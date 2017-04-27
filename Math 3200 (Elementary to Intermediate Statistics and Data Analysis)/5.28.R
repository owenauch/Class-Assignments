# 100 standard normals
z <- rnorm(100)

# 100 chi-square with df = 4
u <- rchisq(100, 4)

# compute t
t <- ((2*z)/(sqrt(u)))

# get percentiles 
quantile(t, probs = c(0.25, 0.5, 0.75))

# actual t percentiles
qt(c(.25, .5, .75), 4)

# get t-squared
t_square <- t^2
hist(t_square)
quantile(t_square, probs = c(.1, 0.25, 0.5, 0.75, .9))

# get real f-dist quantiles
qf(c(.1, .25, .5, .75, .9), 1, 4)

