import os
import redis

redis_connector = redis.Redis(
    host=os.environ.get('REDIS_HOST', 'redis'),
    port=os.environ.get('REDIS_PORT', '6379'),
    db=0
)
