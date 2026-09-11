import os, sys
from gtts import gTTS

AUDIO_DIR = r"c:\Users\LENOVO\Desktop\ESL美語遊戲製作\V3_Game\color_mixing_lab\audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

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

    # 課文核心句型 (V3 Lesson 3)
    "sent_red_blue": "Red and blue make purple.",
    "sent_red_yellow": "Red and yellow make orange.",
    "sent_blue_yellow": "Blue and yellow make green.",
    "sent_black_white": "Black and white make gray.",
    "sent_blue_red": "Blue and red make purple.",
    "sent_yellow_blue": "Yellow and blue make green.",

    # 關卡提問 (Prompts)
    "prompt_1": "Can you make Purple? What colors do you need?",
    "prompt_2": "Can you make Orange? What colors do you need?",
    "prompt_3": "Can you make Green? What colors do you need?",
    "prompt_4": "Can you make Gray? What colors do you need?",
    "prompt_5": "Try again! Blue and what color make purple?",
    "prompt_6": "Final Challenge! Yellow and what color make green?",

    # 系統互動反饋 (System Feedback)
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

print(f"Synthesizing {len(VOICE_SCRIPTS)} Google TTS audio clips...")

for key, text in VOICE_SCRIPTS.items():
    out_path = os.path.join(AUDIO_DIR, f"{key}.mp3")
    print(f"  Generating {key}.mp3: \"{text}\"")
    tts = gTTS(text=text, lang='en', tld='com', slow=False)
    tts.save(out_path)

print("All Google TTS audio files generated successfully!")
