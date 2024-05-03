# A program to send Neural Net structure from the server, run a number of tests,
# and receive the results back to be processed, and run its own tests while waiting

##Removed Code

import socket
import sys
import threading
import time
from argparse import ArgumentParser
import json
import argparse
import  ##package

resultsNameList = []
import  ##package

ThreadKill = True  # Kill process if taking to long


def handle_client(client_socket, addr, args, clientNumber):
    try:
        while True:
            # receive and print client messages
            request = client_socket.recv(1024).decode("utf-8")
            print(f"Received: {request} from {addr}")
            if request == 'Ready for a new job!':
                packArgs(args)
                sendInfoToClient(args, client_socket, addr)
                resultsName = 'results' + str(clientNumber) + '.txt'
                recieveFile(resultsName, client_socket, addr)
                resultsNameList.append(resultsName)
        if ThreadKill:
            sys.exit()
    except Exception as e:
        print(f"Error when hanlding client: {e}")
    finally:
        client_socket.close()
        print(f"Connection to client ({addr[0]}:{addr[1]}) closed")


def run_server():
    # Run the server and handle the clients
    args = getDefaultArgs()
    server_ip = "10.0.0.37"  # server hostname or IP address
    port = 5000  # server port number
    # create a socket object
    try:
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # bind the socket to the host and port
        server.bind((server_ip, port))
        # listen for incoming connections
        server.listen()
        print(f"Listening on {server_ip}:{port}")
        clientNumber = 1
        Threading = False
        Timeout = 0
        while Threading or Timeout < 120:
            # accept a client connection
            ThreadKill = False
            thread = threading.Thread(target=threadListening, args=(server, args, clientNumber))
            thread.start()
            if thread.is_alive():
                pass
            elif threading.active_count() < 2:
                Threading = True
            elif threading.active_count() == 1:  # Only the listener thread is active. Count to 2min. Will count forward 1 for every client accepted
                Threading = False
                Timeout += 1
                time.sleep(1)
        thread.stop()
        ThreadKill = True
    except Exception as e:
        print(f"Error: {e}")
    finally:
        server.close()


def threadListening(server, args, clientNumber):
    client_socket, addr = server.accept()
    print(f"Accepted connection from {addr[0]}:{addr[1]}")
    # start a new thread to handle the client
    thread = threading.Thread(target=handle_client, args=(client_socket, addr, args, clientNumber,))
    thread.start()
    if ThreadKill:
        sys.exit()


def sendFile(file, client_socket, addr):
    # Send a file to the server
    f = open(file, 'rb')
    l = f.read(1024)
    counter = 0
    while (l):
        client_socket.send(l)
        l = f.read(1024)
        counter += 1
        if (counter % 5) == 0:
            print('Sending : ' + str(file) + ' to ' + str(addr))
    doneMsg = 'done'
    client_socket.send(doneMsg.encode("utf-8")[:1024])
    print('Done sending : ' + str(file) + ' to ' + str(addr))
    f.close()


def recieveFile(file, client_socket, addr):
    # Recieve a file from the server
    f = open(file, 'wb')
    l = client_socket.recv(1024)
    counter = 0
    while (l):

        f.write(l)
        l = client_socket.recv(1024)
        try:
            if l.decode("utf-8") == 'done':
                break
        except:
            pass
        counter += 1
        if (counter % 5) == 0:
            print('Recieving : ' + str(file) + ' from ' + str(addr))
    print('Done Recieving : ' + str(file) + ' from ' + str(addr))
    f.close()


def str_to_dict(string):
    # Converts a str to a dict
    string = string.strip('{}')
    pairs = string.split(', ')
    return {key[1:-2]: int(value) for key, value in (pair.split(': ') for pair in pairs)}


def packArgs(args):
    # Read arguments and write to text file
    fileName = '../args.txt'
    with open(fileName, 'w') as f:
        json.dump(args.__dict__, f, indent=2)


def unpackArgs():
    # Read test file and convert to arguments
    parser = ArgumentParser()
    args = parser.parse_args()
    with open('../args.txt', 'r') as f:
        args.__dict__ = json.load(f)
    return args


def sendInfoToClient(args, client_socket, addr):
    # Send to client
    packArgs(args)
    sendFile('../args.txt', client_socket, addr)
    sendFile((str(args.actor_model) + '.pth'), client_socket, addr)
    sendFile((str(args.critic_model) + '.pth'), client_socket, addr)


def getDefaultArgs():
    # Get arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('--Name', dest='Name', type=None, default=None)
    args = parser.parse_args()
    return args


def  ##Run(args):
    ##Run NN while waiting
    return  ##results


def  ##UpdateNN():


##Update Neural Net

# run the server
run_server()
