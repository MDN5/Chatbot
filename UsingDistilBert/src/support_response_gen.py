import json
import pandas as pd
import requests
from bs4 import BeautifulSoup

from datetime import datetime

from flask import request
from googletrans import Translator

from src.modules.email_sender import EmailSender

from src.modules.config import ConfigLoader
from src.modules.mongo_config import MongoConnection
db_conn= MongoConnection()

## GENERATE RESPONSE AND SEND EMAIL

Loader_instance = ConfigLoader()      
configuration = Loader_instance.read_configuration()


class BIDashboardResponseGen:

    def get_cookie(self,somecookiename):
        try:
            value = request.cookies.get(somecookiename)
            return value
        except:
            return "Unable to process request"

    def translate_to_english(self, sent):
        try:
            translator = Translator()
            eng = translator.translate(sent, dest='en')
            return eng.src, eng.text
        except:
            return "We are facing some server issues, Please try after sometime!"

    def translate_to_target_language(self, opt):
        try:
            lang = self.get_cookie("language")
            translator = Translator()
            opt = translator.translate(opt, dest=lang)
            return opt.text
        except:
            return "We are facing some server issues, Please try after sometime!"
        
    # Scraping using Beautiful Soup

    def get_data(self, url):
        webpage = requests.get(url).text
        soup = BeautifulSoup(webpage, "html.parser")

        url_title = soup.find("meta", property="og:title")
        url_description = soup.find("meta", property="og:description")
        url_img = soup.find("meta", property="og:image")
        if url_img:
            if url_img["content"].startswith( 'https' ):
                url_img["content"] = url_img["content"]
            else:
                url_img["content"] = "static/img/logo.jpg"
        else:
            url_img = {}
            url_img["content"] = "static/img/logo.jpg"
        title = url_title["content"] if url_title else "/Details/" 
        description = url_description["content"] if url_description else ""
        img = url_img["content"]

        return title, description, img

    def get_image(self, url):
        webpage = requests.get(url).text
        soup = BeautifulSoup(webpage, "html.parser")
        url_img = soup.find("meta", property="og:image")
        img = url_img["content"] if url_img else "static/img/blank-icon.jpg"

        return img

    # Fallback Text
    def fallback(self):
        response = {
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            self.translate_to_target_language("Sorry, I couldn't get you!")
                        ]
                    }
                },
                {
                    "text": {
                        "text": [
                            self.translate_to_target_language("Do you want further assistance?")
                        ]
                    }
                }
            ],
            "message": "error",
            "status": "500"
        }
        return response

    def fallback_support(self, user_query):
            try:
                name = self.get_cookie("name")
                email = self.get_cookie("email")
                email_sender = EmailSender()
                email_sender.send_email_to_support(name, email, 'request', user_query=user_query)
                response = {
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    self.translate_to_target_language("Email sent to support team! You will be contacted soon")
                                ]
                            }
                        },
                        {
                            "text": {
                                "text": [
                                    self.translate_to_target_language("Do you want further assistance?")
                                ]
                            }
                        }
                    ],
                    "message": "success",
                    "status": "200"
                }
            except:
                response = {
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    self.translate_to_target_language("We are facing some server issues, Please try after sometime!")
                                ]
                            }
                        },
                        {
                            "text": {
                                "text": [
                                    self.translate_to_target_language("Do you want further assistance?")
                                ]
                            }
                        }
                    ],
                    "message": "error",
                    "status": "500"
                }
            return response

    def fallback_support_dashboard_access(self, dashboard_name, dashboard_type):
        try:
            name = self.get_cookie("name")
            email = self.get_cookie("email")
            email_sender = EmailSender()
            email_sender.send_email_to_support(name, email, 'dashboard_issues', dashboard_url="URL_HERE", issue_description=f"Dashboard access issue for {dashboard_type} named {dashboard_name}")
            response = {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [
                                self.translate_to_target_language("We have sent email to support team regarding your dashboard access. It will be sort out within 24 hours.")
                            ]
                        }
                    },
                    {
                        "text": {
                            "text": [
                                self.translate_to_target_language("Do you want further assistance?")
                            ]
                        }
                    }
                ],
                "message": "success",
                "status": "200"
            }
        except:
            response = {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [
                                self.translate_to_target_language("We are facing some server issues, Please try after sometime!")
                            ]
                        }
                    },
                    {
                        "text": {
                            "text": [
                                self.translate_to_target_language("Do you want further assistance?")
                            ]
                        }
                    }
                ],
                "message": "error",
                "status": "500"
            }
        return response


    def registered_users(self):
        try:
            email = self.get_cookie("email")
            # Connect to your database, assuming you have a method to handle this
            db_object, db_admin_object = db_conn.db_connection()
            # Query to retrieve registered user information
            registered_user = db_admin_object.bi_users.find({"email": email})
            registered_user = list(registered_user)
            if registered_user:
                response = {
                    "message": "success",
                    "status": "200",
                    "intent": "Dashboard_Access",
                    "intent_type": "General"
                }
            else:
                # If user is not registered
                response = {
                    "fulfillmentMessages": [
                            {
                                "text": {
                                    "text": [
                                        self.translate_to_target_language("Sorry, you are not a registered user. Please contact the BI team to get access to the dashboards.")
                                    ]
                                }
                            },
                            {
                                "text": {
                                    "text": [
                                        self.translate_to_target_language("Do you need further assistance?")
                                    ]
                                }
                            }
                        ],
                    "message": "error",
                    "status": "500",
                    "intent": "Dashboard_Access",
                    "intent_type": "General"
                }
        except Exception as e:
            print(e) 
            response = {
                "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    self.translate_to_target_language("Sorry, we are unable to process your request at the moment. Please try again later.")
                                ]
                            }
                        },
                        {
                            "text": {
                                "text": [
                                    self.translate_to_target_language("Do you need further assistance?")
                                ]
                            }
                        }
                    ],
                "message": "error",
                "status": "500",
                "intent": "Dashboard_Access",
                "intent_type": "General"
            }
        return response