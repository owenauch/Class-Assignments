# get data
data = read.csv("/Users/owenauch/Documents/Sophomore Year/Math 3200/R/mercury.csv")
library(car)
library(leaps)
library(glmnet)

x1 = data$Alkalin
x2 = data$calcium
x3 = data$pH
y = data$Mercury

# scatter plots without change
plot(x1,y)
plot(x2,y)
plot(x3,y)

# scatter plots with log transformation
x1_log = log(x1)
x2_log = log(x2)
y_log = log(y)

plot(x1_log,y_log)
plot(x2_log,y_log)

# fit of log transformation
log_fit = lm(y_log ~ x1_log + x2_log + x3)
summary(log_fit)

# confidence intervals
confint(log_fit)

# refit the model by excluding x2 and x3
log_refit = lm(y_log ~ x1_log)
summary(log_refit)

# fit linear model
lin_model = lm(y_log ~ x1_log + x2_log)
summary(lin_model)
plot(lin_model)

resids = resid(lin_model)
plot(x1_log, resids)
plot(x2_log, resids)
plot(y, resids)

# plot against x3
plot(x3, resids)

# get vifs of data
vif(log_fit)

# best subsets regression for Cp
reg_sub = regsubsets(y_log ~ x1_log + x2_log + x3, data=data, nbest=1)
plot(reg_sub, scale="Cp")
summary(reg_sub)
m = lm(y_log ~ x1_log)
summary(m)

# best subsets regression for R^2
plot(reg_sub, scale="adjr2")

# best subset regression for AIC
plot(reg_sub, scale="bic")

# ridge regression
library(MASS)
lam = seq(0,5,.001)
regrid = lm.ridge(y_log ~ x1_log + x2_log + x3, lambda=lam)
plot(regrid)

# LASSO regression
new_x = matrix(c(x1_log, x2_log, x3), ncol=3)
cv.lasso = glmnet(new_x, y, alpha=1)
plot(cv.lasso)
