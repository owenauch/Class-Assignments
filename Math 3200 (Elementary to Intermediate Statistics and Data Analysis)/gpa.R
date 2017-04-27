# get data
data = read.csv("/Users/owenauch/Documents/Sophomore Year/Math 3200/R/gpa.csv")

y = data$y
x1 = data$x1
x2 = data$x2

# fit model
fit = lm(y ~ x1 + x2)
summary(fit)

# 95% CIs
confint(fit, c("x1", "x2"), level=0.95)
