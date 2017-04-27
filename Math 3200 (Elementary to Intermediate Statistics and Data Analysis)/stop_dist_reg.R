# get data
stop_dist = read.csv("/Users/owenauch/Documents/Sophomore Year/Math 3200/R/stop-dist.csv")

stop = stop_dist$Stop
speed = stop_dist$Speed

# fit a line
model = lm(stop ~ speed)
residuals = resid(model)

# plot residuals
plot(speed, residuals)

# summary of model
summary(model)

# square all of speeds and make new model based on this transformation
speedsq = speed^2

sqmodel = lm(stop ~ speedsq)

# get residuals and plot it 
residsq = resid(sqmodel)

plot(speed, residsq)

# summary
summary(sqmodel)

# predict car travelling 40 mph
newdata=data.frame(speedsq=1600)
predict(sqmodel,newdata,interval="predict")


