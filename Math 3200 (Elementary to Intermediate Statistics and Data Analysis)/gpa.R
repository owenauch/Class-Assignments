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

# plot residuals against x1 and x2
lin_resids = resid(fit)
plot(x1, lin_resids)
plot(x2, lin_resids)

# quadratic fit
x1_sq = x1^2
x2_sq = x2^2
x1_x2 = x1*x2

quad_fit = lm(y ~ x1+x2+x1_sq+x2_sq+x1_x2)

quad_resid = resid(quad_fit)
plot(x1, quad_resid)
plot(x2, quad_resid)
plot(y, quad_resid)

summary(quad_fit)

# find outliers
plot(quad_fit)

v = c(34,15,2)
k = which(rownames(data)%in%v)
quad_fit_2 = update(quad_fit, .~., data=data[-k,])
summary(quadfit_2)

# 11.31
b1hat = (0.025732) * (16.10/0.694)
b1hat

b2hat = (0.033615) * (13.15/0.694)
b2hat

b1hat2 = (0.529 - (-0.107 * 0.573))/ ( 1 - (-0.107)**2)
b1hat2

b2hat2 = (0.573 - (-0.107 * 0.529))/ ( 1 - (-0.107)**2)
b2hat2

