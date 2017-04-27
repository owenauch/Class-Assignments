# get data
data = read.csv("/Users/owenauch/Documents/Sophomore Year/Math 3200/R/life.csv")

time = data$year - 1920
male = data$male
female = data$female

# plot it
plot(time, male)
plot(time, female)

# quadratic variable
time_sq = time^2

# quadratic male model
male_fit = lm(male ~ time + time_sq)
summary(male_fit)

# quadratic female model
female_fit = lm(female ~ time + time_sq)
summary(female_fit)

# calculate 95% PI 2030
newdata = data.frame(time=110, time_sq=110^2)
predict(male_fit, newdata, interval="predict") 

