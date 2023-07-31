import secrets
from datetime import timedelta
from eth_account import Account
from eth_account.messages import encode_defunct
from rest_framework_simplejwt.tokens import RefreshToken
from railgun_backend.redis import redis_connector

from . import models


def get_random(address):
    message = 'Token to sign for authentication:\n' + secrets.token_hex(64)
    # TODO delete from here and create task
    redis_connector.set(address, message, ex=timedelta(minutes=3))
    return message


def check_signature(address, signature):
    message = redis_connector.getdel(address)
    if (
        message is None or
        address.lower() != Account.recover_message(
            encode_defunct(text=message.decode()),
            signature=signature
        ).lower()
    ):
        return None
    return get_tokens_for_user(address)


def get_tokens_for_user(address):
    user = models.User.objects.get_or_create(username=address)[0]
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
