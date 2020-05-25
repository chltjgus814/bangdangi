import os
import re
import logging
import warnings

logger = logging.getLogger(__name__)


def check_environment_file(is_debug=True):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_file = os.path.join(base_dir, '.env')

    if is_debug and os.path.isfile(env_file):
        try:
            with open(env_file) if isinstance(env_file, str) else env_file as f:
                content = f.read()
        except IOError:
            warnings.warn(
                ".env 파일을 읽어올 수 없습니다."
            )
            return

        logger.debug('환경변수를 다음 파일에서 읽어옵니다: {0}'.format(env_file))

        for line in content.splitlines():
            m1 = re.match(r'\A(?:export )?([A-Za-z_0-9]+)=(.*)\Z', line)

            if m1:
                key, val = m1.group(1), m1.group(2)
                m2 = re.match(r"\A'(.*)'\Z", val)
                if m2:
                    val = m2.group(1)
                
                m3 = re.match(r'\A"(.*)"\Z', val)
                if m3:
                    val = re.sub(r'\\(.)', r'\1', m3.group(1))
                
                os.environ.setdefault(key, str(val))
