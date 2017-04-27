# get data
data = read.csv("/Users/owenauch/Documents/Sophomore Year/Math 3200/R/boiling.csv")

pressure = data$pressure
boil = data$boil

# plot
plot(pressure, boil)

# reg line
model = lm(boil ~ pressure)
abline(model)
summary(model)

# MSE
sum(model$residuals^2) / 15

# fit 95% CI with pressure of 28
newdata = data.frame(pressure=28)
predict(model, newdata, interval="confidence")

# fit 95% CI with pressure of 31
newdata2 = data.frame(pressure=31)
predict(model, newdata2, interval="confidence")

# fit 95% PI with pressure of 31
predict(model, newdata2, interval="predict")
