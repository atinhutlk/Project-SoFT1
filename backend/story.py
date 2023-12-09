import textwrap

story = '''Agent 007, embarked on a daring mission across Europe to recover the stolen Mona Lisa.
Armed with limited money and fuel, he faced tough choices. Some cities held secret boxes with tempting prizes – 300e, 600e, or 1000e, 
or the dreaded Boom Mail, which could take half his money.
Fuel consumption was 1e for every 2 kilometers.
007's challenge was to manage resources wisely, navigate risks, and return the masterpiece to the Louvre.'''

wrapper = textwrap.TextWrapper(width=80, break_long_words=False, replace_whitespace=False)
word_list = wrapper.wrap(text=story)

def get_story():
    return word_list

def get_story_plain_text():
    return story