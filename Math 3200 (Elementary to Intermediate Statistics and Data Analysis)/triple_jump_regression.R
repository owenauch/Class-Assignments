# get data
trip_jump = read.csv("/Users/owenauch/Documents/Sophomore Year/Math 3200/R/Mens-Triple-Jump-Distance.csv")

dist = trip_jump$Dist
year = trip_jump$Year

# get model
model = lm(dist ~ year)

# plot triple jump data
plot(trip_jump)
abline(model)

# get MSE estimate
sqresid = model$residuals^2
sum(sqresid) / 19


# get summary
summary(model)

# get correlation coefficient
cor(trip_jump$Year, trip_jump$Dist)

# correlation test 
cor.test(trip_jump$Year, trip_jump$Dist)

# calculate 95% PI
newdata = data.frame(year=2004)
predict(model, newdata, interval="predict") 
