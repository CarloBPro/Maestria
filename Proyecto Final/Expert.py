import contextlib
import sys
import time
global Pdp1, TF, start

print("Please only use Yes, No, Maybe for non instruction question or instructed action for the questions")






#Tipo de bloqueo


def BLQ():
    TBLQ = input("Que tipo de bloqueo tiene? Price block or GR (answer PB or GR)").lower()

    if TBLQ == "pb":
             FNOSM = input("La factura y la orden tienen el mismo precio?").lower

    elif TBLQ == "gr":
            MRCP = input("Se recibio el material?").lower

    else:
            print("No diste una de las posibles respuestas") 
            BLQ()


def BLQ():
    TBLQ = input("Que tipo de bloqueo tiene? Price block or GR (answer PB or GR)").lower()

    if TBLQ == "pb":
             FNOSM = input("La factura y la orden tienen el mismo precio?").lower

    elif TBLQ == "gr":
            MRCP = input("Se recibio el material?").lower

    else:
            print("No diste una de las posibles respuestas") 
            BLQ()

#esta pendiente de pago
def PDPF():
    PdtP = input("Esta pedndiente de Pago?").lower()

    if PdtP == "yes":
            BLQ()

    elif PdtP == "no":
            print("Factura Pagada") 

    else:
            print("No diste una de las posibles respuestas") 
            PDPF()

#tipo de orden
def Tipe1():
    TF = input("Que tipo de orden es? Orden de compra o herramental ( answer OC or T)").lower()

    if TF == "oc":
            PDPF()

    elif TF == "t":
            Tl= input("La orden de compra coincide con el herramental?")

    else:
            print("No diste una de las posibles respuestas")  
            Tipe1()

#informacción correcta
def InfoCorr():

    IFC2 = input("La información de la factura en el sistema esta correcta ").lower()

    if IFC2 == "yes":
            Tipe1()

    elif IFC2 == "no":
            print("revisa con CPP que capture correctamente la factura")

    else:
            print("No diste una de las posibles respuestas")
            InfoCorr()


def starting():

    FR = input("La factura esta registrada ").lower()
    if FR=="yes":

        InfoCorr()

    elif FR== "no":

        print("Has que CPP Carge la factura a sistema")

    elif FR == "maybe":

        print("Revisa con FBL1N el numero de factura")

    else:

        print("No diste una de las posibles respuestas")
        starting()

starting()

