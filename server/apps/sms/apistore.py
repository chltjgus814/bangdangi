from django.conf import settings
from django.apps import apps
import requests


class ApiStore:
    client_id = 'bangdangi'
    base_url = 'https://api.apistore.co.kr/ppurio'
    header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-waple-authorization': settings.APISTORE_KEY
    }

    def __init__(self):
        pass

    def save_send_number(self, send_number, comment, pin_type, pin_code=None):
        data = {
            'sendnumber': send_number,
            'comment': comment,
            'pintype': pin_type,
        }
        if pin_code is not None:
            data.update({
                'pincode': pin_code
            })

        res = requests.post(
            '{base_url}/{api_version}/sendnumber/save/{client_id}'.format(
                base_url=self.base_url,
                api_version=2,
                client_id=self.client_id
            ),
            headers=self.header,
            data=data
        )
        result = res.json()
        result_code = result.get('result_code', '0')
        if result_code != '200':
            return False
        return True

    def get_send_number(self):
        res = requests.get(
            '{base_url}/{api_version}/sendnumber/list/{client_id}'.format(
                base_url=self.base_url,
                api_version=2,
                client_id=self.client_id
            ),
            headers=self.header
        )
        result = res.json()
        result_code = result.get('result_code', '0')
        if result_code != '200':
            return []
        
        number_list = result.get('numberList', [])
        return number_list

    def send(self, phone, title, body):
        send_number = apps.get_model('sms.SendNumber').objects.first()
        if send_number is None:
            return False
        send_number = send_number.phone
        res = requests.post(
            '{base_url}/{api_version}/message/sms/{client_id}'.format(
                base_url=self.base_url,
                api_version=1,
                client_id=self.client_id
            ),
            headers=self.header,
            data={
                'dest_phone': phone,
                'send_name': '방단기',
                'send_phone': send_number,
                'subject': title,
                'msg_body': body,
            }
        )

        result = res.json()
        result_code = result.get('result_code', '400')
        if result_code != '200':
            return False
        return True