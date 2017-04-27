#read data and display
data <- read.csv(file="smoking.csv", header=TRUE)
data

#get totals of each group
totalSmokers = data$SMOKERS.DEAD + data$SMOKERS.ALIVE
totalNonSmokers = data$NONSMOKERS.ALIVE + data$NONSMOKERS.DEAD

#get number of each group
columns = colSums(Filter(is.numeric, data))
smokerDead = columns[1]
smokerAlive = columns[2]
nonSmokerDead = columns[3]
nonSmokerAlive = columns[4]

#get death rate for smokers (based on previous data)
smokerDeathRate = smokerDead/(smokerDead+smokerAlive)

#get death rate for nonsmokers (based on previous data)
nonSmokerDeathRate = nonSmokerDead/(nonSmokerAlive+nonSmokerDead)

#display results
smokerDeathRate
nonSmokerDeathRate

#get death rate for each group
smokeAge = data$SMOKERS.DEAD/totalSmokers
nonSmokeAge = data$NONSMOKERS.DEAD/totalNonSmokers

#get total for each age
ageRows = rowSums(Filter(is.numeric, data))
total = ageRows[1] + ageRows[2] + ageRows[3] + ageRows[4] + ageRows[5]

#adjust death rate by multiplying death rate for each
#age by the number of total people at each age group
#and dividing it by the total people surveyed
smokerAdjusted = ((smokeAge[1]*ageRows[1]) + (smokeAge[2]*ageRows[2]) + (smokeAge[3]*ageRows[3]) + (smokeAge[4]*ageRows[4]) + (smokeAge[5]*ageRows[5]) + (smokeAge[6]*ageRows[6]) + (smokeAge[7]*ageRows[7])) / (total)
nonSmokerAdjusted = ((nonSmokeAge[1]*ageRows[1]) + (nonSmokeAge[2]*ageRows[2]) + (nonSmokeAge[3]*ageRows[3]) + (nonSmokeAge[4]*ageRows[4]) + (nonSmokeAge[5]*ageRows[5]) + (nonSmokeAge[6]*ageRows[6]) + (nonSmokeAge[7]*ageRows[7])) / (total)

#display smoker and nonsmoker adjusted
smokerAdjusted
nonSmokerAdjusted