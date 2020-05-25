import random


prefix_names = [
    '착한',
    '정직한',
    '산뜻한',
    '매혹스러운',
    '당황한',
    '놀란',
    '지루한',
    '기쁜',
    '감동한',
    '지친',
    '귀찮은',
    '행복한',
    '반가운',
    '재밌는',
    '통괘한',
]
sufifx_names = [
    '사자',
    '호랑이',
    '곰',
    '돼지',
    '코끼리',
    '다람쥐',
    '고슴도치',
    '비버',
    '사슴',
    '여우',
    '코뿔소',
    '고릴라',
    '고양이',
    '개',
    '말',
]


def generate_random_name():
    prefix_name = random.choice(prefix_names)
    sufifx_name = random.choice(sufifx_names)

    return '{} {}'.format(
        prefix_name,
        sufifx_name
    )