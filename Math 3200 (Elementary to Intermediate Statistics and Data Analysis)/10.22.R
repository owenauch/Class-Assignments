# get data
data = read.csv("/Users/owenauch/Documents/Sophomore Year/Math 3200/R/10.22.csv")

# plots
x1 = data$x1
x2 = data$x2
y1 = data$y1
y2 = data$y2
y3 = data$y3
y4 = data$y4

# fit lines to each graph
model1 = lm(y1 ~ x1)
plot(x1, y1)
abline(model1)
summary(model1)

model2 = lm(y2 ~ x1)
plot(x1, y2)
abline(model2)
summary(model2)

model3 = lm(y3 ~ x1)
plot(x1, y3)
abline(model3)
summary(model3)

model4 = lm(y4 ~ x2)
plot(x2, y4)
abline(model4)
summary(model4)


