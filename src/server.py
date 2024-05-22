# main.py
import boto3
import botocore
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import ldclient
from ldclient import Context
from ldclient.config import Config
from threading import Lock, Event
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

import os

# Set LaunchDarkly SDK key
os.environ["LAUNCHDARKLY_SDK_KEY"] = "sdk-be68ac5e-fe0d-4dc0-8eff-600daffeaa0a"

sdk_key = os.getenv("LAUNCHDARKLY_SDK_KEY")

# Set feature_flag_key to the feature flag key you want to evaluate.
feature_flag_key = "toggle_db"

# Initialize the Bedrock client
bedrock_runtime = boto3.client('bedrock-runtime')

def show_evaluation_result(key: str, value: bool):
    print()
    print(f"*** The {key} feature flag evaluates to {value}")

class FlagValueChangeListener:
    def __init__(self):
        self.__show_banner = True
        self.__lock = Lock()

    def flag_value_change_listener(self, flag_change):
        with self.__lock:
            if self.__show_banner and flag_change.new_value:
                show_banner()
                self.__show_banner = False

            show_evaluation_result(flag_change.key, flag_change.new_value)

@app.get("/flag-state")
async def get_flag_state():
    # Set feature_flag_key to the feature flag key you want to evaluate.
    feature_flag_key = "toggle_db"

    if not sdk_key:
        return JSONResponse(status_code=500, content={"error": "LAUNCHDARKLY_SDK_KEY environment variable is not set"})
    if not feature_flag_key:
        return JSONResponse(status_code=500, content={"error": "Feature flag key is not set"})

    ldclient.set_config(Config(sdk_key))

    if not ldclient.get().is_initialized():
        return JSONResponse(status_code=500, content={"error": "Failed to initialize LaunchDarkly SDK"})

    # Set up the evaluation context. This context should appear on your
    # LaunchDarkly contexts dashboard soon after you run the demo.
    context = Context.builder('example-user-key').kind('user').name('Sandy').build()

    flag_value = ldclient.get().variation(feature_flag_key, context, False)

    return JSONResponse(status_code=200, content={"flag_key": feature_flag_key, "flag_state": flag_value})

class PromptRequest(BaseModel):
    prompt: str

@app.post("/invoke")
async def invoke_model(prompt_request: PromptRequest):
    model_config = json.dumps({"inputText": prompt_request.prompt, "textGenerationConfig": {"topP": 0.95, "temperature": 0.2}})
    modelId = "amazon.titan-tg1-large"
    accept = "application/json"
    contentType = "application/json"

    try:
        response = bedrock_runtime.invoke_model(
            body=model_config, modelId=modelId, accept=accept, contentType=contentType
        )
        response_body = json.loads(response.get("body").read())
        output_text = response_body.get("results")[0].get("outputText")
        print(output_text)

        return {"response": output_text}

    except botocore.exceptions.ClientError as error:
        raise HTTPException(status_code=500, detail=str(error))
    
def configure_launchdarkly():
    # Set sdk_key to your LaunchDarkly SDK key.
    # Set feature_flag_key to the feature flag key you want to evaluate.
    feature_flag_key = "toggle_db"

    if not sdk_key:
        print("*** Please set the LAUNCHDARKLY_SDK_KEY env first")
        exit()
    if not feature_flag_key:
        print("*** Please set the LAUNCHDARKLY_FLAG_KEY env first")
        exit()

    ldclient.set_config(Config(sdk_key))

    if not ldclient.get().is_initialized():
        print("*** SDK failed to initialize. Please check your internet connection and SDK credential for any typo.")
        exit()

    print("*** SDK successfully initialized")

    # Set up the evaluation context. This context should appear on your
    # LaunchDarkly contexts dashboard soon after you run the demo.
    context = Context.builder('example-user-key').kind('user').name('Sandy').build()

    flag_value = ldclient.get().variation(feature_flag_key, context, False)
    show_evaluation_result(feature_flag_key, flag_value)

    change_listener = FlagValueChangeListener()
    listener = ldclient.get().flag_tracker \
        .add_flag_value_change_listener(feature_flag_key, context, change_listener.flag_value_change_listener)


if __name__ == "__main__":
    import uvicorn
    configure_launchdarkly()

    uvicorn.run(app, host="127.0.0.1", port=8000)
