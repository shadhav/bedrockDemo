from flask import Flask, render_template, request, jsonify
import requests
import datetime
import hashlib
import hmac
import base64
import json
import os
import time
app = Flask(__name__)

# AWS API credentials
aws_access_key = '' #Add your access key
aws_secret_key = '' #Add your secret key
aws_region = 'us-east-1'
aws_service = 'bedrock'

@app.route('/')
def index():
    return render_template('index.html')

#Summarization UI
@app.route('/index2')
def index2():
    return render_template('index2.html')

#Chatbot UI
@app.route('/index3')
def index3():
    return render_template('index3.html')

#Titan API Call
@app.route('/api/call-python1', methods=['POST'])
def call_python1():
    payload = request.json
    input_text = payload.get('inputText', '')
    chunk_size = 4000
    retry = 0
    chunks = [input_text[i:i + chunk_size] for i in range(0, len(input_text), chunk_size)]
    results = []
    combined_result = []
    for chunk in chunks:
        # Request information
        http_method = 'POST'
        api_endpoint = 'https://bedrock.us-east-1.amazonaws.com'
        api_path = '/model/amazon.titan-tg1-large/invoke'
        payload_json = json.dumps({'inputText': chunk})
        # Generate a timestamp in ISO 8601 format
        timestamp = datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
        # Generate a date string in YYYYMMDD format
        datestamp = datetime.datetime.utcnow().strftime('%Y%m%d')
        # Generate a canonical request
        canonical_request = '\n'.join([
            http_method,
            api_path,
            '',
            'content-type:application/json',
            'host:' + api_endpoint.replace('https://', ''),
            'x-amz-date:' + timestamp,
            '',
            'content-type;host;x-amz-date',
            hashlib.sha256(payload_json.encode('utf-8')).hexdigest()
        ])
        # Generate a string to sign
        string_to_sign = '\n'.join([
            'AWS4-HMAC-SHA256',
            timestamp,
            f'{datestamp}/{aws_region}/{aws_service}/aws4_request',
            hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
        ])
        # Generate the signing key
        key = ('AWS4' + aws_secret_key).encode('utf-8')
        k_date = hmac.new(key, datestamp.encode('utf-8'), hashlib.sha256).digest()
        k_region = hmac.new(k_date, aws_region.encode('utf-8'), hashlib.sha256).digest()
        k_service = hmac.new(k_region, aws_service.encode('utf-8'), hashlib.sha256).digest()
        signing_key = hmac.new(k_service, 'aws4_request'.encode('utf-8'), hashlib.sha256).digest()
        # Generate the signature
        signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
        # Generate the authorization header
        authorization_header = f'AWS4-HMAC-SHA256 Credential={aws_access_key}/{datestamp}/{aws_region}/{aws_service}/aws4_request, ' \
                               f'SignedHeaders=content-type;host;x-amz-date, Signature={signature}'
        # Make the API request
        headers = {
            'Content-Type': 'application/json',
            'Host': api_endpoint.replace
            ('https://', ''),
            'x-amz-date': timestamp,
            'Authorization': authorization_header
        }
        response = requests.post(api_endpoint + api_path, headers=headers, data=payload_json)
        print(response.status_code)
        
        if response.status_code == 200:
            result = response.json()
            #print(result)
            results.append(result)
            
        elif response.status_code in [429,503] and retry < 4:
            #code to sleep for 1 sec
            time.sleep(1)
            retry += 1
            #code to call the api again
            response = requests.post(api_endpoint + api_path, headers=headers, data=payload_json)
            result = response.json()
            results.append(result)
            
        else:
            for result in results:
                output_text = result.get('results', [{}])[0].get('outputText', '')
                #print(output_text)
                combined_result.append(output_text)
                #print(combined_result)
            
    # Process the response
    
    for result in results:
        output_text = result.get('results', [{}])[0].get('outputText', '')
        combined_result.append(output_text)
        
    return jsonify(output_text=combined_result)


#Stability Diffusion API Call

endpoint = 'https://bedrock.us-east-1.amazonaws.com'
path = '/model/stability.stable-diffusion-xl/invoke'
@app.route('/api/call-python2', methods=['POST'])
def call_python2():
    # API payload
    payload = request.json
    
    # Generate a timestamp in ISO 8601 format
    timestamp = datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    # Generate a date string in YYYYMMDD format
    
    datestamp = datetime.datetime.utcnow().strftime('%Y%m%d')
    # Generate a canonical request
    canonical_request = '\n'.join([
        'POST',
        path,
        '',
        'content-type:application/json',
        'host:' + endpoint.replace('https://', ''),
        'x-amz-date:' + timestamp,
        '',
        'content-type;host;x-amz-date',
        hashlib.sha256(payload['body'].encode('utf-8')).hexdigest()
    ])
    # Generate a string to sign
    string_to_sign = '\n'.join([
        'AWS4-HMAC-SHA256',
        timestamp,
        f'{datestamp}/{aws_region}/{aws_service}/aws4_request',
        hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
    ])
    # Generate the signing key
    key = ('AWS4' + aws_secret_key).encode('utf-8')
    k_date = hmac.new(key, datestamp.encode('utf-8'), hashlib.sha256).digest()
    k_region = hmac.new(k_date, aws_region.encode('utf-8'), hashlib.sha256).digest()
    k_service = hmac.new(k_region, aws_service.encode('utf-8'), hashlib.sha256).digest()
    signing_key = hmac.new(k_service, 'aws4_request'.encode('utf-8'), hashlib.sha256).digest()
    # Generate the signature
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    # Generate the authorization header
    authorization_header = f'AWS4-HMAC-SHA256 Credential={aws_access_key}/{datestamp}/{aws_region}/{aws_service}/aws4_request, ' \
                           f'SignedHeaders=content-type;host;x-amz-date, Signature={signature}'
    # Make the API request
    headers = {
        'Content-Type': 'application/json',
        'Host': endpoint.replace('https://', ''),
        'x-amz-date': timestamp,
        'Authorization': authorization_header
    }
    response = requests.post(endpoint + path, headers=headers, data=payload['body'])
    print(response)
    # Process the response
     # Return the image data as JSON response
    return jsonify(response.json())



#Anthropic API Call
# Request information
anthropicendpoint = 'https://bedrock.us-east-1.amazonaws.com'
anthropicpath = '/model/anthropic.claude-instant-v1/invoke'
@app.route('/api/call-python3', methods=['POST'])
def call_python3():
    # API payload
    payload = request.json
    
    print("Invking the api----------------------", payload)
    # Generate a timestamp in ISO 8601 format
    timestamp = datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    # Generate a date string in YYYYMMDD format
    
    datestamp = datetime.datetime.utcnow().strftime('%Y%m%d')
    # Generate a canonical request
    canonical_request = '\n'.join([
        'POST',
        anthropicpath,
        '',
        'content-type:application/json',
        'host:' + anthropicendpoint.replace('https://', ''),
        'x-amz-date:' + timestamp,
        '',
        'content-type;host;x-amz-date',
        hashlib.sha256(payload['body'].encode('utf-8')).hexdigest()
    ])
    # Generate a string to sign
    string_to_sign = '\n'.join([
        'AWS4-HMAC-SHA256',
        timestamp,
        f'{datestamp}/{aws_region}/{aws_service}/aws4_request',
        hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
    ])
    # Generate the signing key
    key = ('AWS4' + aws_secret_key).encode('utf-8')
    k_date = hmac.new(key, datestamp.encode('utf-8'), hashlib.sha256).digest()
    k_region = hmac.new(k_date, aws_region.encode('utf-8'), hashlib.sha256).digest()
    k_service = hmac.new(k_region, aws_service.encode('utf-8'), hashlib.sha256).digest()
    signing_key = hmac.new(k_service, 'aws4_request'.encode('utf-8'), hashlib.sha256).digest()
    # Generate the signature
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    # Generate the authorization header
    authorization_header = f'AWS4-HMAC-SHA256 Credential={aws_access_key}/{datestamp}/{aws_region}/{aws_service}/aws4_request, ' \
                           f'SignedHeaders=content-type;host;x-amz-date, Signature={signature}'
    # Make the API request
    headers = {
        'Content-Type': 'application/json',
        'Host': anthropicendpoint.replace('https://', ''),
        'x-amz-date': timestamp,
        'Authorization': authorization_header
    }
    response = requests.post(anthropicendpoint + anthropicpath, headers=headers, data=payload['body'])
    # Process the response
    responsedata = response.json()
    #print(responsedata['completion'])
    responsedata = response.json()
    output_text =responsedata['completion']
    return jsonify(output_text)

if __name__ == '__main__':
    app.run(debug=True)