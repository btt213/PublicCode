# A program to receive Neural Net structure from the server, run a number of tests,
# and send the results back to be processed

##removed code

import socket
import  ##package
from argparse import ArgumentParser
import json
import  ##package


def run_client():
    # create a socket object
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_ip =  ##ip  # replace with the server's IP address
    server_port =  ##port  # replace with the server's port number
    # establish connection with server
    client.connect((server_ip, server_port))

    try:
        # get input message from user and send it to the server
        msg = str('Ready for a new job!')
        client.send(msg.encode("utf-8")[:1024])
        # get arguments. Determines size
        recieveFile('../args.txt', client)
        print('Recieved arguments')
        args = unpackArgs()
        # get actor model
        recieveFile((str(args.actor_model) + '.pth'), client)
        print('Recieved actor model')
        # get critic model
        recieveFile((str(args.critic_model) + '.pth'), client)
        print('Recieved critic model')
        # run session of NN
        ##run

        saveToFileResults(  ##results)
            sendFile('results.txt', client)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # close client socket (connection to the server)
        client.close()
        print("Connection to server closed")


def  ##run(args):


##Run a testing session of the NN

def sendFile(file, client_socket):
    # Send a file to the server
    f = open(file, 'rb')
    l = f.read(1024)
    counter = 0
    while (l):
        client_socket.send(l)
        l = f.read(1024)
        counter += 1
        if (counter % 5) == 0:
            print('Sending :' + str(file) + ' to server')
    doneMsg = 'done'
    client_socket.send(doneMsg.encode("utf-8")[:1024])
    print('Done sending :' + str(file) + ' to server')
    f.close()


def recieveFile(file, client_socket):
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
            print('Recieving :' + str(file) + ' from server')
    print('Done recieving :' + str(file) + ' from server')
    f.close()


def saveToFileResults(data):
    # Save return as text file. For diagnostic purposes
    f = open('results.txt', 'wb')
    f.write(data)
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
    return


def unpackArgs():
    # Read test file and convert to arguments
    parser = ArgumentParser()
    args = parser.parse_args()
    with open('../args.txt', 'r') as f:
        args.__dict__ = json.load(f)
    return args


# Starts file and run infinitely
while True:
    run_client()
