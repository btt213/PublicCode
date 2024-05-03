import PySimpleGUI as sg
import os.path
import requests
import numpy
import pandas as pd
import matplotlib.pyplot as plt
import datetime as dt
from sklearn.linear_model import LinearRegression

class MiWeatherData:
    #Obtain page data from URL and convert to text
    URL = "http://www.rssweather.com/climate/Michigan/Detroit/"
    page = requests.get(URL)
    text = page.text

    #set boundries to focus on the table and not overshoot
    pos = -1
    posMax = -1
    pos = text.find('<table>', pos + 1)
    posMax = text.find('</table>', posMax +1)

    #create lists to house data obtained
    monthList = []
    lowList = []
    highList = []
    
    #loop and collect data while in the table
    while pos < posMax:
        #find start of table data in Month column
        pos = text.find('<td>', pos + 1)
        #catch as can overshoot looking for next table data
        if pos > posMax:
            break
        #find end of data for month column
        subStringStop = text.find('</td>', pos + 1)
        #select what data enters variable
        month = text[int(pos)+4:int(subStringStop)]
        #update location to end of data
        pos = subStringStop
    
        #Find next data for temperate low and repeat prior steps
        pos = text.find('<td>', pos + 1)
        subStringStop = text.find('</td>', pos + 1)
        low = text[int(pos)+4:int(subStringStop)-1]
        #trim data to cut out "&deg;" which creates the degree sign
        low = low[0:int(low.find('&', 0))] + low[int(low.find(';', 0))+1:int(low.find(';', 0))+2]
        pos = subStringStop
    
        #Find next data for temperate low and repeat prior steps
        pos = text.find('<td>', pos + 1)
        subStringStop = text.find('</td>', pos + 1)
        high = text[int(pos)+4:int(subStringStop)-1]
        #trim data to cut out "&deg;" which creates the degree sign
        high = high[0:int(high.find('&', 0))] + high[int(high.find(';', 0))+1:int(high.find(';', 0))+2]
        pos = subStringStop

        #attach data to lists
        monthList.append(month)
        lowList.append(float(low))
        highList.append(float(high))
    #create a dataset from the lists
    MIdataset = pd.DataFrame({'Month':monthList, 'Low':lowList, 'High':highList})


class Equine:
    #Obtain page data from URL and convert to text
    URL = "https://www.cdc.gov/easternequineencephalitis/tech/epi.html"
    page = requests.get(URL)
    text = page.text

    #set boundries to focus on the table and not overshoot
    pos = -1
    posMax = -1
    pos = text.find('<div class="table-responsive">', pos + 1)
    posMax = text.find('</div>', pos)
    pos = text.find('<div class="table-responsive">', pos + 1)
    posMax = text.find('</div>', pos)
    pos = text.find('<div class="table-responsive">', pos + 1)
    posMax = text.find('</div>', pos)
    text = text[pos:posMax+6]
    pos = text.find('tr', 0)
    text = text[pos:-1]
    pos = text.find('tr', 10)
    text = text[pos:-1]
    pos = text.find('tr', 10)
    text = text[pos:-1]
    posMax = len(text)


    #create lists to house data obtained
    yearList = []
    neuroInvNumList = []
    neuroInvPerList = []
    nonNeuroInvNumList = []
    nonNeuroInvPerList = []
    totalNumList = []
    totalPerList = []

    #loop and collect data while in the table
    while (pos < posMax) or (text.find('<tr>',0) != -1):
        subText = text[text.find('<tr>',0):text.find('</tr>',0)]
        text = text[text.find('</tr>',0)+1:]
        if text.find('<tr>',0) == -1:
            break
        year = subText[subText.find('</th>',0)-4:subText.find('</th>',0)]
        subText = subText[subText.find('</th>',0):]
        
        
        neuroInvNum = subText[subText.find('">',0)+2:subText.find('</td>',0)]
        if neuroInvNum.find('nbsp;',0) != -1:
            neuroInvNum = neuroInvNum[neuroInvNum.find('nbsp;',0)+5:]
        subText = subText[subText.find('</td>',0)+6:]
        
        neuroInvPer = subText[subText.find('">',0)+2:subText.find('</td>',0)]
        subText = subText[subText.find('</td>',0)+6:]
        if neuroInvPer.find('nbsp;',0) == 1:
            neuroInvPer = neuroInvPer[neuroInvPer.find('nbsp;',0)+5:]
        if neuroInvPer.find('nbsp;',0) != -1:
            neuroInvPer = neuroInvPer[:neuroInvPer.find('nbsp;',0)-1]
        
        nonNeuroInvNum = subText[subText.find('">',0)+2:subText.find('</td>',0)]
        subText = subText[subText.find('</td>',0)+1:]
        if nonNeuroInvNum.find('nbsp;',0) != -1:
            nonNeuroInvNum = nonNeuroInvNum[nonNeuroInvNum.find('nbsp;',0)+5:]
      
        nonNeuroInvPer = subText[subText.find('">',0)+2:subText.find('</td>',0)]
        subText = subText[subText.find('</td>',0)+1:]
        if nonNeuroInvPer.find('nbsp;',0) == 1:
            nonNeuroInvPer = nonNeuroInvPer[nonNeuroInvPer.find('nbsp;',0)+5:]
        if nonNeuroInvPer.find('nbsp;',0) != -1:
            nonNeuroInvPer = nonNeuroInvPer[:nonNeuroInvPer.find('nbsp;',0)-1]


        totalNum = subText[subText.find('">',0)+2:subText.find('</td>',0)]
        subText = subText[subText.find('</td>',0)+1:]
        if totalNum.find('nbsp;',0) != -1:
            totalNum = totalNum[totalNum.find('nbsp;',0)+5:]
            
        totalPer = subText[subText.find('">',0)+2:subText.find('</td>',0)]
        if totalPer.find('nbsp;',0) == 1:
            totalPer = totalPer[totalPer.find('nbsp;',0)+5:]
        if totalPer.find('nbsp;',0) != -1:
            totalPer = totalPer[:totalPer.find('nbsp;',0)-1]
        
        #attach data to lists
        yearList.append(int(year))
        neuroInvNumList.append(int(neuroInvNum))
        neuroInvPerList.append(int(neuroInvPer))
        nonNeuroInvNumList.append(int(nonNeuroInvNum))
        nonNeuroInvPerList.append(int(nonNeuroInvPer))
        totalNumList.append(int(totalNum))
        totalPerList.append(int(totalPer))
    #create a dataset from the lists
    equineDataset = pd.DataFrame({'Year':yearList, 'NeuroinvasiveDiseaseCases':neuroInvNumList, 'NeuroinvasiveDiseaseDeaths':neuroInvPerList, 'Non-NeuroinvasiveDiseaseCases':nonNeuroInvNumList, 'Non-NeuroinvasiveDiseaseDeaths':nonNeuroInvPerList, 'Total':totalNumList, 'TotalDeaths':totalPerList})

    

class LakeErie():
    url= pd.read_excel('erieMog.xls', header = 0)
    erieDataset = pd.DataFrame(url)
    




#Create Four rows of options on the left
file_list_column = [
    [
        sg.Text('Michigan Average Temperature',size=(33,1)),
        sg.Button('Plot',key='-MiATPlot-'),
        sg.Button('Regression',key='-MiATRegression-')
    ],
    [
        sg.Text('Eastern Equine Encephalitis',size=(33,1)),
        sg.Button('Plot',key='-EEEPlot-'),
        sg.Button('Regression',key='-EEERegression-')
    ],
    [
        sg.Text('Lake Erie Water Levels',size=(33,1)),
        sg.Button('Plot',key='-LEWLPlot-'),
    ],
]

# For now will only show the name of the file that was chosen
image_viewer_column = [
    [sg.Text("Choose an option on the left:")],
    [sg.Image(size=(40,40),key="-IMAGE-")],
]

# ----- Full layout -----
layout = [
    [
        sg.Column(file_list_column),
        sg.VSeperator(),
        sg.Column(image_viewer_column),
    ]
]

#Window Manager
window = sg.Window("IS Final", layout)
while True:
    event, values = window.read()
    plt.clf()
    if event == "Exit" or event == sg.WIN_CLOSED:
        break
    
    # Folder name was filled in, make a list of files in the folder
    if event == "-MiATPlot-":
        MIData = MiWeatherData()
        ax = plt.gca()
        MIData.MIdataset.plot(kind='line',x='Month', y='Low',ax=ax)
        MIData.MIdataset.plot(kind='line',x='Month', y='High',color='red',ax=ax)
        plt.show(block=False)

    elif event == "-MiATRegression-":
        MIData = MiWeatherData()
        model = LinearRegression(fit_intercept=True)
        model.fit(MIData.MIdataset['Low'][:,numpy.newaxis],MIData.MIdataset['High'])
        xfit = numpy.linspace(0,10,1000)
        yfit = model.predict(xfit[:,numpy.newaxis])
        plt.scatter(MIData.MIdataset['Low'],MIData.MIdataset['High'])
        plt.scatter(xfit,yfit,s=1)
        plt.show()
    if event == "-EEEPlot-":
        ax = plt.gca()
        equine = Equine()
        equine.equineDataset.plot(kind='line',x='Year', y='NeuroinvasiveDiseaseCases',ax=ax)
        equine.equineDataset.plot(kind='line',x='Year', y='NeuroinvasiveDiseaseDeaths',color='red',ax=ax)
        equine.equineDataset.plot(kind='line',x='Year', y='Non-NeuroinvasiveDiseaseCases',color='cyan',ax=ax)
        equine.equineDataset.plot(kind='line',x='Year', y='Non-NeuroinvasiveDiseaseDeaths',color='green',ax=ax)
        equine.equineDataset.plot(kind='line',x='Year', y='Total',color='m',ax=ax)
        equine.equineDataset.plot(kind='line',x='Year', y='TotalDeaths',color='y',ax=ax)
        plt.show(block=False)


    elif event == "-EEERegression-":
        equine = Equine()
        model = LinearRegression(fit_intercept=True)
        model.fit(equine.equineDataset['NeuroinvasiveDiseaseCases'][:,numpy.newaxis],equine.equineDataset['NeuroinvasiveDiseaseDeaths'])
        xfit = numpy.linspace(0,10,1000)
        yfit = model.predict(xfit[:,numpy.newaxis])
        plt.scatter(equine.equineDataset['NeuroinvasiveDiseaseCases'],equine.equineDataset['NeuroinvasiveDiseaseDeaths'])
        plt.scatter(xfit,yfit,s=1)
        plt.show()

    elif event == '-LEWLPlot-':
        Lakeerie=LakeErie()
        ax = plt.gca()
        Lakeerie.erieDataset.plot(kind='line',x='Date', y='Average',ax=ax)
        plt.show(block=False)
window.close()
