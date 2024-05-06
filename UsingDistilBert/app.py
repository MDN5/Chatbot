import os
import json
import numpy as np
from datetime import datetime, timezone
from flask import Flask, request, jsonify, render_template
from flask_cors import cross_origin
from src.scrape import scraping
from src.modules.config import ConfigLoader
from src.models.distilbert import DistilBERT
from src.support_response_gen import BIDashboardResponseGen
from src.modules.mongo_config import MongoConnection
# from pymongo import MongoClient
# from database import mongo_connection

import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)

generate_response = BIDashboardResponseGen()
scrape_data = scraping()

Loader_instance = ConfigLoader()      
configuration = Loader_instance.read_configuration()

model = DistilBERT()
database_connection = MongoConnection()

@app.route('/')
@cross_origin()
def home():
    return render_template("index.html")

@app.route('/api/userdetails', methods=['POST'])
@cross_origin()
def user_details():
    try:
        name = request.form['name']
        email = request.form['email']
        mobile = request.form['mobile']
        user = {
            "name": name,
            "email": email,
            "mobile": mobile,
            "datetime": datetime.now(timezone.utc)
        }
        db_object, db_admin_object = database_connection.db_connection()
        user_details = db_object.userdetails.insert_one(user)
        response = {
            "message": "success",
            "status": "200"
        }
    except:
        response = {
            "message": "error",
            "status": "500"
        }
    return jsonify(response)


# Intend Classification

@app.route('/api/prediction', methods=['POST'])
@cross_origin()
def prediction():
    try:
        query = request.form['query']
        _, query = generate_response.translate_to_english(query)
        result = model.model_pred(query)                               # Distilbert classifies message.
        print(result[1][0])

        db_object, db_admin_object = database_connection.db_connection()
        name = generate_response.get_cookie('name')
        email = generate_response.get_cookie('email')
        mobile = generate_response.get_cookie('mobile')
        userchat = {
            "name": name,
            "email": email,
            "mobile": mobile,
            "datetime": datetime.now(timezone.utc),
            "Content": query,
            "Predicted Intent": result[1][0],
            "Confidence Score": result[0]
        }
        user_chat = db_object.UserChat.insert_one(userchat)

        general_intent = np.load('nlp/intents/general_intent.npy', allow_pickle=True)
        technical_intent = np.load('nlp/intents/technical_intent.npy', allow_pickle=True)
        scrape_data_filter = np.load('nlp/intents/scrape_data.npy', allow_pickle=True)
        ticket_gen_filter = np.load('nlp/intents/ticket_gen.npy', allow_pickle=True)
        form_filter = np.load('nlp/intents/form_filter.npy', allow_pickle=True)
        list_thumbnail_filter = np.load('nlp/intents/list_thumbnail.npy', allow_pickle=True)

        if result[1][0] in technical_intent:
            res_satisfied_or_assistance = 'Are you satisfied with your query?'
            intent_type = 'Technical'
        elif result[1][0] in ticket_gen_filter and result[1][0] in general_intent:
            res_satisfied_or_assistance = 'Do you want further assistance?'
            intent_type = 'General'
        else:
            res_satisfied_or_assistance = 'Are you satisfy with your query or you want to generate ticket for it? Please select suitable option.'
            intent_type = 'General'

        if result[0] >= 50 and result[1][0] not in scrape_data_filter:
            result = result[1]
            ip = result[0]
            f = open('load_intent_filter/intents_map.json')
            data = json.load(f)

            if ip == "Dashboard_access":
                response_access = generate_response.fallback_support_dashboard_access()
            elif ip in ticket_gen_filter:
                response = BIDashboardResponseGen().fallback_support(query)
            else:
                response = {
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    generate_response.translate_to_target_language(data[ip])
                                ]
                            }
                        },
                        {
                            "text": {
                                "text": [
                                    generate_response.translate_to_target_language(res_satisfied_or_assistance)
                                ]
                            }
                        }
                    ],
                    "intent": ip,
                    "message": "success",
                    "status": "200",
                    "intent_type": intent_type
                }       
        else:
            print('predicted intent : ' + str(result[1][0]))
            list_of_keyword = scrape_data.keyword_extract(query)
            print(list_of_keyword)
            if len(list_of_keyword) > 0:
                strings = ' + '.join(list_of_keyword)
                response = scrape_data.scrapping_url(strings)
                user_scrap_reply = {
                    "email": email,
                    "datetime": datetime.now(timezone.utc),
                    "Content": query,
                    "Extracted Words": list_of_keyword,
                    "Scrapping Response": response
                }
                user_scrap_chat = db_object.ScrappingChat.insert_one(user_scrap_reply)
            else:
                response = {
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    generate_response.translate_to_target_language(
                                        "Sorry!! we are not able to process your query at a moment. Please try again later.")
                                ]
                            }
                        },
                        {
                            "text": {
                                "text": [
                                    generate_response.translate_to_target_language("Do you want further assistance?")
                                ]
                            }
                        }
                    ],
                    "intent": "Not_identified",
                    "message": "error",
                    "status": "500",
                    "intent_type": "General"
                }
    except:
        response = {
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            generate_response.translate_to_target_language(
                                "Sorry!! we are unable to process your request at this time. Please try again later.")
                        ]
                    }
                },
                {
                    "text": {
                        "text": [
                            generate_response.translate_to_target_language("Do you want further assistance?")
                        ]
                    }
                }
            ],
            "message": "error",
            "status": "500",
            "intent_type": "General"
        }
    print(response)
    return jsonify(response)



@app.route('/api/languageTranslateWithThumbnail', methods=['POST'])
@cross_origin()
def languageTranslateWithThumbnail():
    try:
        content = request.get_json()
        query = content['msg']
        output = generate_response.translate_to_target_language(query)
        list_of_url = [output, content['url_link']]
        res_satisfied_or_assistance = "Do you want further assistance?"
        intent_type = "General"
        response = scrape_data.thumbnail_generate(list_of_url, res_satisfied_or_assistance, intent_type)
    except:
        response = {
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            generate_response.translate_to_target_language(
                                "Sorry!! we are not able to process your query at a moment. Please try again later.")
                        ]
                    }
                },
                {
                    "text": {
                        "text": [
                            generate_response.translate_to_target_language("Do you want further assistance?")
                        ]
                    }
                }
            ],
            "message": "error",
            "status": "500"
        }
    return jsonify(response)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print("Starting app on port %d" % port)
    app.run(debug=True, port=port, host="127.0.0.1")
