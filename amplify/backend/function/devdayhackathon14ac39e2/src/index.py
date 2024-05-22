import boto3
import botocore
import json 

# Initialize the Bedrock client
bedrock_runtime = boto3.client('bedrock-runtime')

def lambda_handler(event, context):
    
    model_config = json.dumps({"inputText": event['prompt'], "textGenerationConfig" : {"topP":0.95, "temperature":0.2}})
    modelId = "amazon.titan-tg1-large"
    accept = "application/json"
    contentType = "application/json"

    try:

        response = bedrock_runtime.invoke_model(
            body=model_config, modelId=modelId, accept=accept, contentType=contentType
        )
        response_body = json.loads(response.get("body").read())
    
        return {
            'statusCode': 200,
            'body': json.dumps(response_body.get("results")[0].get("outputText"))
        }
    
    except botocore.exceptions.ClientError as error:
    
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(error)})
        }
