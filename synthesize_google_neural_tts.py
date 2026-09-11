import os, sys, json, base64, urllib.request, time

AUDIO_DIR = r"c:\Users\LENOVO\Desktop\ESL美語遊戲製作\V3_Game\color_mixing_lab\audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

API_KEY_PATH = r"c:\Users\LENOVO\Desktop\ESL美語遊戲製作\語音API KEY.txt"
with open(API_KEY_PATH, 'r', encoding='utf-8') as f:
    API_KEY = f.read().strip()

URL = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={API_KEY}"

VOICE_SCRIPTS = {
    # 顏色單字
    "color_red": "Red",
    "color_blue": "Blue",
    "color_yellow": "Yellow",
    "color_black": "Black",
    "color_white": "White",
    "color_purple": "Purple",
    "color_orange": "Orange",
    "color_green": "Green",
    "color_gray": "Gray",

    # 課文核心句型 (V3 Lesson 3: Mixing Colors)
    "sent_red_blue": "Red and blue make purple.",
    "sent_red_yellow": "Red and yellow make orange.",
    "sent_blue_yellow": "Blue and yellow make green.",
    "sent_black_white": "Black and white make gray.",
    "sent_blue_red": "Blue and red make purple.",
    "sent_yellow_blue": "Yellow and blue make green.",

    # 關卡引導提問 (Prompts)
    "prompt_1": "Can you make Purple? What colors do you need?",
    "prompt_2": "Can you make Orange? What colors do you need?",
    "prompt_3": "Can you make Green? What colors do you need?",
    "prompt_4": "Can you make Gray? What colors do you need?",
    "prompt_5": "Try again! Blue and what color make purple?",
    "prompt_6": "Final Challenge! Yellow and what color make green?",

    # 互動提示與系統反饋 (System Feedback)
    "msg_welcome": "Welcome to the Magic Laboratory! Let's mix colors!",
    "msg_full": "The cauldron is full! Press Stir or Clear.",
    "msg_pick_two": "Please pick two colors first!",
    "msg_cleared": "Cleared!",
    "msg_retry_purple": "Oops! That does not make purple. Try again!",
    "msg_retry_orange": "Oops! That does not make orange. Try again!",
    "msg_retry_green": "Oops! That does not make green. Try again!",
    "msg_retry_gray": "Oops! That does not make gray. Try again!",
    "msg_complete": "Congratulations! You are a master color chemist!"
}

print(f"Synthesizing {len(VOICE_SCRIPTS)} studio-grade Google Cloud Neural2 audio clips...")

for key, text in VOICE_SCRIPTS.items():
    out_path = os.path.join(AUDIO_DIR, f"{key}.mp3")
    payload = {
        'input': {'text': text},
        'voice': {
            'languageCode': 'en-US',
            'name': 'en-US-Neural2-F' # Google Cloud 最高階兒童教學友善女聲
        },
        'audioConfig': {
            'audioEncoding': 'MP3',
            'speakingRate': 0.92, # 稍慢速度利於學童聆聽與跟讀
            'pitch': 1.2 # 親切清脆語調
        }
    }

    req = urllib.request.Request(
        URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            audio_bytes = base64.b64decode(data['audioContent'])
            with open(out_path, 'wb') as audio_file:
                audio_file.write(audio_bytes)
            print(f"  ✓ {key}.mp3 ({len(audio_bytes):,} bytes): \"{text}\"")
        # 避免觸發 API 頻率限制
        time.sleep(0.1)
    except Exception as e:
        print(f"  ✗ Error on {key}: {e}")

print("All Google Cloud Neural2 audio files synthesized and saved successfully!")
