import requests, json
from bs4 import BeautifulSoup
from rake_nltk import Rake
from fake_useragent import UserAgent
import random
from itertools import cycle
import re
from urllib.parse import urlparse
from src.support_response_gen import BIDashboardResponseGen

# Calling API File
response_gen = BIDashboardResponseGen() 

class scraping:

    # extract Keyword
    def keyword_extract(self,str):
        try:
            r = Rake()
            r.extract_keywords_from_text(str)
            res = r.get_ranked_phrases()
            print(res)
            return res
        except:
            return "Unable to extract keyword"

    def scrapping_url(self,query): # from https://rapidapi.com/hub
        try:
            url = "https://google-search95.p.rapidapi.com/api/v1/search/q={}&num=3".format(query)  
            headers = {
                "X-RapidAPI-Key": "925a33d4ebmshf6144771f6811e4p1286d0jsnd4e8175ad6f3",
                "X-RapidAPI-Host": "google-search95.p.rapidapi.com"
            }

            response = requests.get(url, headers=headers)
            res = response.json()
            reply = self.thumbnail_generate_scraping(res)

        except:
            reply = {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [
                                response_gen.translate_to_target_language("Apologies, we're currently unable to fulfill your request. Please try again later.")
                            ]
                        }
                    },
                    {
                        "text": {
                            "text": [
                                response_gen.translate_to_target_language("Do you require additional assistance?")
                            ]
                        }
                    }
                ],
                "message": "error",
                "status": "500",
                "intent":"Not_identified",
                "intent_type": "General"
            }
        return reply
    
    def thumbnail_generate_scraping(self,list_of_url):
        try:
            relist = []
            for i in list_of_url["results"]:
                resdata = dict()
                try:
                    print(i)
                    # Thumbnail code start
                    resdata["title"] = i["title"]
                    resdata["description"] = i["description"]
                    resdata["image"] = response_gen.get_image(i["link"])
                    resdata["url"] = i["link"]
                    relist.append(resdata)
                    # Thumbnail code end
                except:
                    print(str(i)+' index name not found')
            if len(relist) != 0:
                response = {
                     "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    response_gen.translate_to_target_language("Please find below some reference links for your query:",)
                                ]
                            }
                        }
                    ],
                    "result": relist,
                    "message": "success",
                    "status": "200",
                    "intent":"Not_identified",
                    "intent_type": "Technical",
                    "scrape_msg": response_gen.translate_to_target_language("Are you satisfied with the provided information,\
                                                       or would you like to generate a ticket for further assistance?\
                                                       Please choose an option.")
                }
            else:
                response = {
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    response_gen.translate_to_target_language("Apologies, we're currently unable to fulfill your request. Please try again later.")
                                ]
                            }
                        },
                        {
                            "text": {
                                "text": [
                                    response_gen.translate_to_target_language("Do you require additional assistance?")
                                ]
                            }
                        }
                    ],
                    "message": "error",
                    "status": "500",
                    "intent":"Not_identified",
                    "intent_type": "General"
                }
        except:
            response = {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [
                                response_gen.translate_to_target_language("Apologies, we're currently unable to fulfill your request. Please try again later.")
                            ]
                        }
                    },
                    {
                        "text": {
                            "text": [
                                response_gen.translate_to_target_language("Do you require additional assistance?")
                            ]
                        }
                    }
                ],
                "message": "error",
                "status": "500",
                "intent":"Not_identified",
                 "intent_type": "General"
            }
        return response

    def thumbnail_generate(self,list_of_url, res_satisfied_or_assistance, intent_type ):
        try:
            relist = []
            for i in list_of_url[1:]:
                resdata = dict()
                try:
                    # Thumbnail code start
                    title, description, image = response_gen.get_data(i)
                    resdata["title"] = title
                    resdata["description"] = description
                    resdata["image"] = image
                    resdata["url"] = i
                    relist.append(resdata)
                    # Thumbnail code end
                except:
                    print(str(i)+' index name not found')
            if len(relist) != 0:
                response = {
                        "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    response_gen.translate_to_target_language(res_satisfied_or_assistance)
                                ]
                            }
                        }
                    ],
                    "result": relist,
                    "message": "success",
                    "status": "200",
                    "intent":"list_thumbnail",
                    "speak_msg": list_of_url[0],
                    "intent_type": intent_type
                }
            else:
                response = {
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    response_gen.translate_to_target_language("Apologies, we're currently unable to fulfill your request. Please try again later.")
                                ]
                            }
                        },
                        {
                            "text": {
                                "text": [
                                    response_gen.translate_to_target_language("Do you require additional assistance?")
                                ]
                            }
                        }
                    ],
                    "message": "error",
                    "status": "500",
                    "intent":"list_thumbnail",
                        "intent_type": "General"
                }
        except:
            response = {
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    response_gen.translate_to_target_language("Apologies, we're currently unable to fulfill your request. Please try again later.")
                                ]
                            }
                        },
                        {
                            "text": {
                                "text": [
                                    response_gen.translate_to_target_language("Do you require additional assistance?")
                                ]
                            }
                        }
                    ],
                    "message": "error",
                    "status": "500",
                    "intent":"list_thumbnail",
                     "intent_type": "General"
                }
        return response
    

############################3
import requests
import json
from rake_nltk import Rake
from src.support_response_gen import BIDashboardResponseGen

# Calling API File
response_gen = BIDashboardResponseGen()

class Scraper:
    def __init__(self):
        self.headers = {
            'x-rapidapi-key': "e468d98724msh7380b7960df4c02p18c627jsnffbdc0763d43",
            'x-rapidapi-host': "google-search3.p.rapidapi.com"
        }

    def extract_keywords(self, text):
        try:
            r = Rake()
            r.extract_keywords_from_text(text)
            return r.get_ranked_phrases()
        except:
            return "Unable to extract keywords"

    def search_google(self, query):
        try:
            url = "https://google-search3.p.rapidapi.com/api/v1/search/q={}&num=3".format(query)
            response = requests.get(url, headers=self.headers)
            return json.loads(response.text)
        except:
            return None

    def generate_thumbnails(self, results):
        try:
            if not results or "results" not in results:
                raise Exception("Invalid results")
            response_data = []
            for result in results["results"]:
                try:
                    title = result["title"]
                    description = result["description"]
                    image = response_gen.get_image(result["link"])
                    response_data.append({
                        "title": title,
                        "description": description,
                        "image": image,
                        "url": result["link"]
                    })
                except:
                    print("Error processing result:", result)
            return response_data
        except Exception as e:
            print("Error generating thumbnails:", e)
            return None

    def generate_response(self, response_data, success_msg, error_msg):
        if response_data:
            return {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [
                                response_gen.translate_to_target_language(success_msg)
                            ]
                        }
                    }
                ],
                "result": response_data,
                "message": "success",
                "status": "200",
                "intent": "Not_identified",
                "intent_type": "Technical",
                "scrape_msg": response_gen.translate_to_target_language("Are you satisfied with the provided information, or would you like to generate a ticket for further assistance? Please choose an option.")
            }
        else:
            return {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [
                                response_gen.translate_to_target_language(error_msg)
                            ]
                        }
                    },
                    {
                        "text": {
                            "text": [
                                response_gen.translate_to_target_language("Do you require additional assistance?")
                            ]
                        }
                    }
                ],
                "message": "error",
                "status": "500",
                "intent": "Not_identified",
                "intent_type": "General"
            }

    def process_query(self, query):
        try:
            search_results = self.search_google(query)
            if not search_results:
                return self.generate_response(None, "Apologies, we're currently unable to fulfill your request. Please try again later.", "Apologies, we're currently unable to fulfill your request. Please try again later.")

            thumbnails = self.generate_thumbnails(search_results)
            if not thumbnails:
                return self.generate_response(None, "Apologies, we're currently unable to fulfill your request. Please try again later.", "Apologies, we're currently unable to fulfill your request. Please try again later.")

            return self.generate_response(thumbnails, "Please find below some reference links for your query:", "Apologies, we're currently unable to fulfill your request. Please try again later.")
        except Exception as e:
            print("Error processing query:", e)
            return self.generate_response(None, "Apologies, we're currently unable to fulfill your request. Please try again later.", "Apologies, we're currently unable to fulfill your request. Please try again later.")

# # Usage example:
# scraper = Scraper()
# response = scraper.process_query("your query here")
# print(response)


# Modify app to match this script.