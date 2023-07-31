from django.template.response import TemplateResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .utils import check_signature, get_random


# TODO add schema

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_random(request):
    address = request.data.get('address', None)
    if address is None:
        return Response({'error': 'no address submited'}, 400)
    # TODO validate address and if it's valid send token
    message = get_random(address)
    return Response({'message': message})


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_token(request):
    # TODO validate address and if it's valid continue
    address = request.data.get('address', None)
    signature = request.data.get('signature', None)
    if address is None or signature is None:
        return Response({'error': 'no address/signature submited'}, 400)
    token = check_signature(address, signature)
    if token is None:
        return Response(
            {'error': 'wrong signrature, refresh the page and try again'}, 400)
    return Response(token)


@api_view(['GET'])
@permission_classes([AllowAny])
def test(request):
    return TemplateResponse(request, "test.html")


@api_view(['GET'])
@permission_classes([AllowAny])
def test_token(request):
    return Response({'token': 'token are valid'})
