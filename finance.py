"""
L'objectif de ce script est de donner des indicateurs sur un cours d'une action en bourse et de savoir si c'est bien d'investir dedans.
"""


import yfinance as yf
from enum import Enum
import numpy as np
import matplotlib.pyplot as plt

PRECISION_COMPUTATION = 2

class Period(Enum):
	"""
	Enumeration pour la periode d'analyse de la bourse
	"""
	ONE_MONTH = "1mo"
	SIX_MONTH = "6mo"
	ONE_YEAR = "1y"
	TWO_YEARS = "2y"
	THREE_YEARS = "3y"

class Analyst:
	"""
	Classe pour analyser le cours de la bourse
	-> data <list> : donnees du cours de la bourse.
	<openData> : donnees d'ouverture
	<closeData> : donnees de fermeture
	<lowData> : donnees des minimums
	<highData> : donneees des maximums
	<mean> : moyenne
	<simple_moving_average_X> : Moyenne mobile simple pour une période donnée
	<min> : minimum
	<max> : maximum
	<std> : variance
	"""
	def __init__(self, data):
		self.data = data.history
		self.dateData = data.history["Close"].keys().to_list()
		self.openData = data.history["Open"]
		self.closeData = data.history["Close"]
		self.lowData = data.history["Low"]
		self.highData = data.history["High"]
		self.volumeData = data.history["Volume"]
		self.mean = self.getMean(self.closeData)
		self.simpleMovingAverage_50 = self.getSimpleMovingAverage(self.closeData, period = 50)
		self.simpleMovingAverage_100 = self.getSimpleMovingAverage(self.closeData, period = 100)
		self.simpleMovingAverage_200 = self.getSimpleMovingAverage(self.closeData, period = 200)
		self.exponentialMovingAverage = self.getExponentialMovingAverage(self.closeData)
		self.max = self.getMax(self.closeData)
		self.min = self.getMin(self.closeData)
		self.std = self.getStd(self.closeData)

	def getMean(self, _data):
		return round(np.mean(_data), PRECISION_COMPUTATION)

	def getSimpleMovingAverage(self, _data, period = 50):
		return _data.rolling(window = period).mean()

	def getExponentialMovingAverage(self, _data, period = 14):
		return _data.ewm(span = 14, adjust = True).mean()

	def getMax(self, _data):
		return round(max(_data), PRECISION_COMPUTATION)

	def getMin(self, _data):
		return round(min(_data), PRECISION_COMPUTATION)
	
	def getStd(self, _data):
		return round(np.std(_data), PRECISION_COMPUTATION)
	
	def getRSI(self):
		"""
		Relative Strength Index
		Compris entre 0 et 100
		Oscillateur utilisé pour jauger la force d'une tendance et repérer les signes de fin de tendance
		"""
		rsi = 0
		parameter = 14

		deltaList = self.closeData.diff(1)
		gainList = deltaList.where(deltaList > 0, 0)
		lossList = - deltaList.where(deltaList < 0, 0)

		average_gain = gainList.rolling(window = parameter).mean()
		average_loss = lossList.rolling(window = parameter).mean()

		rsList = average_loss / average_gain

		rsi = 100 - (100 / (1 + rsList))
		
		return rsi

	def __str__(self):
		return f"Min : {self.min} | Simple moving average : {self.moy_mob_normale} | Max : {self.max} | Std : {self.std}"

class Bourse:
	"""
	Classe pour enregistrer une entreprise en bourse
	-> ticker <str> : code de l'entreprise
	-> period_analysed <Period> : duree de l'analyse
	<data> : toute la donnee d'une entreprise
	<current> : cours actuel de la bourse
	<low> : cours minimum de la bourse actuelle
	<high> : cours maximal de la bourse actuelle
	<history> : donnees historiques du cours (cours d'ouverture, de fermeture, minimum & maximum par jour...)
	"""
	def __init__(self, ticker, period_analysed):
		self.data = self.getData(ticker)
		self.name = self.getName()
		self.current = self.getCurrent()
		self.low = self.getLow()
		self.high = self.getHigh()
		self.history = self.getHistory(period_analysed)

	def getData(self, ticker):
		return yf.Ticker(ticker)

	def getName(self):
		return self.data.info["shortName"]

	def getCurrent(self):
		return self.data.analyst_price_targets["current"]
    
	def getLow(self):
		return self.data.analyst_price_targets["low"]

	def getHigh(self):
		return self.data.analyst_price_targets["high"]

	def getHistory(self, period_analysed):
		return self.data.history(period=period_analysed)

	def __str__(self):
		return f"Current stock price : {self.current},\nLower stock price of the day: {self.low},\nHigher stock price of the day: {self.high}"

def analyseStockPrice(stockPrice, period_to_analyse):
	enterprise = Bourse(stockPrice, period_to_analyse)
	STOCK_PRICE_ANALYSED = "Close"

	analyse_stock_price = Analyst(enterprise)

	# Display plot
	fig, axs = plt.subplots(2 , 2, sharex=True, figsize=(15, 12))
	fig.suptitle(f"Analyse du cours de la bourse de {enterprise.name}")

	###
	### FIRST GRAPHIC
	###

	axs[0, 0].plot(enterprise.history[STOCK_PRICE_ANALYSED], '-k', label = "Close Stock Price", linewidth = 3)	# Close stock prices
	meanList = [analyse_stock_price.mean] * len(enterprise.history[STOCK_PRICE_ANALYSED]) 						# Mean
	axs[0, 0].plot(analyse_stock_price.dateData, meanList, '--b', label = "Mean")								# Mean
	axs[0, 0].plot(analyse_stock_price.simpleMovingAverage_50, '--m', label = "Simple Moving Average (50)")		# Simple Moving Average 50
	axs[0, 0].plot(analyse_stock_price.simpleMovingAverage_100, '--c', label = "Simple Moving Average (100)")	# Simple Moving Average 100
	axs[0, 0].plot(analyse_stock_price.simpleMovingAverage_200, '--y', label = "Simple Moving Average (200)")	# Simple Moving Average 200
	minList = [analyse_stock_price.min] * len(enterprise.history[STOCK_PRICE_ANALYSED])							# Lowest stock price
	axs[0, 0].plot(analyse_stock_price.dateData, minList, '--r', label = "Minimum Level Stock Price")			# Lowest stock price
	maxList = [analyse_stock_price.max] * len(enterprise.history[STOCK_PRICE_ANALYSED])							# Highest stock price
	axs[0, 0].plot(analyse_stock_price.dateData, maxList, '--g', label = "Maximum Level Stock Price")			# Highest stock price
	
	## Display functions
	axs[0, 0].grid(True)
	axs[0, 0].set(xlabel = "Date", ylabel = "Prix du cours en €")
	plt.setp(axs[0, 0].xaxis.get_majorticklabels(), rotation=45, ha='right')
	axs[0, 0].legend()


	###
	### SECOND GRAPHIC
	###

	axs[0, 1].plot(enterprise.history[STOCK_PRICE_ANALYSED], '-k', label = "Close Stock Price", linewidth = 3)
	axs[0, 1].plot(analyse_stock_price.exponentialMovingAverage, '--c', label = "Exponential Moving Average") 	# Exponential Moving Average
	axs[0, 1].grid(True)
	axs[0, 1].set(xlabel = "Date", ylabel = "Prix du cours en €")
	plt.setp(axs[0, 1].xaxis.get_majorticklabels(), rotation=45, ha='right')
	axs[0, 1].legend()

	###
	### THIRD GRAPHIC
	###

	axs[1, 0].plot(analyse_stock_price.volumeData, '--g', label = "Volume")
	axs[1, 0].set(xlabel = "Date", ylabel = "Volume")
	plt.setp(axs[1, 0].xaxis.get_majorticklabels(), rotation=45, ha='right')
	axs[1, 0].grid(True)
	axs[1, 0].legend()

	###
	### FOURTH GRAPHIC
	###

	rsiList = analyse_stock_price.getRSI()
	long = len(rsiList)
	axs[1, 1].plot(rsiList, '--k', label = "Close Stock Price", linewidth = 2)
	minVerticalBar = [30] * long
	maxVerticalBar = [70] * long
	axs[1, 1].plot(analyse_stock_price.dateData, minVerticalBar, '--r', label = "Oversell")	
	axs[1, 1].plot(analyse_stock_price.dateData, maxVerticalBar, '--b', label = "Overbuy")	
	axs[1, 1].plot()
	axs[1, 1].set(xlabel = "Date", ylabel = "RSI")
	plt.setp(axs[1, 1].xaxis.get_majorticklabels(), rotation=45, ha='right')
	axs[1, 1].grid(True)
	axs[1, 1].legend()

	###
	### Initialiser la ligne verticale
	###

	line00 = axs[0, 0].axvline(color= 'r', linestyle = '--', linewidth = 1)
	line10 = axs[1, 0].axvline(color= 'r', linestyle = '--', linewidth = 1)
	line01 = axs[0, 1].axvline(color= 'r', linestyle = '--', linewidth = 1)
	line11 = axs[1, 1].axvline(color= 'r', linestyle = '--', linewidth = 1)
	# Fonction pour mettre à jour la position de la ligne verticale
	def update_line(event):
		if event.inaxes:
			line00.set_xdata(event.xdata)
			line10.set_xdata(event.xdata)
			line01.set_xdata(event.xdata)
			line11.set_xdata(event.xdata)
			fig.canvas.draw()
			fig.canvas.flush_events()

	# Connecter la fonction de mise à jour à l'événement de mouvement de la souris
	fig.canvas.mpl_connect('motion_notify_event', update_line)

	###
	### DISPLAY GRAPHICS
	###

	plt.tight_layout()
	plt.show()

if __name__ == "__main__":
	period_to_analyse = Period.ONE_YEAR.value
	analyseStockPrice("AIR.PA", period_to_analyse)