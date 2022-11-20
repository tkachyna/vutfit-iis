from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from matplotlib.patheffects import TickedStroke
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.utils import timezone
# Create your views here.

from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from stack_data import Serializer

import json
from .serializers import ModelSerializer, TicketSerializer
from .models import Ticket, User, TicketComment

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# make entities available as SQLAlchemy models

# listing view for testing queries

db = create_engine("postgresql://sjveswfknevejv:9e0fa8e636ec37e3291efd037869aa17e7a647aaaefa6cd388a3f6b06daaa21f@ec2-52-18-116-67.eu-west-1.compute.amazonaws.com:5432/d9qsrplp2cv1ao")
Session = sessionmaker(bind=db)
session = Session()

def listing(request):
    data = {
        "users": User.query().filter(User.role == 1),
    }

    return render(request, "listing.html", data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['password'] = user.password
        token['role'] = 'admin' if user.username == 'admin' else 'citizen'
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh'
    ]
    return Response(routes)


@api_view(['POST'])
def regUser(request):
    data = json.loads(request.body)
    user = User.objects.create_user(
        username=data['user'],
        email=data['email'],
        password=data['password'],
        city=data['city'],
        street=data['street'],
        house_number=data['house_number'],
        zipcode=data['zipcode'],
        phone_number=data['phone_number'])
    return HttpResponse()


@api_view(['POST'])
def createTicket(request):
  #  db = create_engine(
   #     "postgresql://sjveswfknevejv:9e0fa8e636ec37e3291efd037869aa17e7a647aaaefa6cd388a3f6b06daaa21f@ec2-52-18-116-67.eu-west-1.compute.amazonaws.com:5432/d9qsrplp2cv1ao")
   # Session = sessionmaker(bind=db)

    #session = Session()
    ticket = Ticket.sa
    data = json.loads(request.body)

    user = User.sa
    u = user.query().filter(user.id == data['id'])
    print(type(u))
    if u.count() == 0:
        return Response(data={'Not existing citizen!!'}, status=status.HTTP_400_BAD_REQUEST)
    if u[0].role != 1:
        return Response(data={'User is not citizen!!'}, status=status.HTTP_400_BAD_REQUEST)

    # print(data['text'])
    try:
        # kontrola, ze je customer citizen a admin spravce??
        test = ticket(description=data['description'], name=data['name'], state=1, customer_id=data['id'], admin_id=3,
                      creation_date_time=timezone.now())
        # print(test.description)
        session.add(test)
        session.commit()

        # tickets = ticket.query().all()
        # print(tickets)
        test_as_dic = {c.name: getattr(test, c.name) for c in ticket.__table__.columns}
        # print(test_as_dic)
        return Response(data=test_as_dic, status=status.HTTP_200_OK)
    except:
        return Response(data={'Incorect data'}, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# def getTickets(request):

# @api_view(['GET'])
# def getMyTickets(request)

# @api_view(['POST'])
# def editMyInfo(request)

@api_view(['POST'])
def postTicketComment(request):
    ticket_comment = TicketComment.sa
    user = User.sa
    ticket = Ticket.sa


    data = json.loads(request.body)
    u = user.query().filter(user.id == data['author_id'])
    if u.count() == 0:
        #session.close()
        return Response(data={'Incorrect user'}, status=status.HTTP_400_BAD_REQUEST)

    t = ticket.query().filter(ticket.id == data['ticket_id'])
    if t.count() == 0:
        #session.close()
        return Response(data={'Incorrect ticket'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        tc = ticket_comment(ticket_id=data['ticket_id'], text=data['text'], creation_date_time=timezone.now(),
                            author_id=data['author_id'])
        session.add(tc)
        session.commit()
        serialized = {c.name: getattr(tc, c.name) for c in ticket_comment.__table__.columns}
        return Response(data=serialized, status=status.HTTP_200_OK)
    except:
        return Response(data={'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
