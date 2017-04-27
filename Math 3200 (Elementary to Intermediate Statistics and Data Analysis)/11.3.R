# get iq_data
iq_data = read.csv("/Users/owenauch/Documents/Sophomore Year/Math 3200/R/iq.csv")
library(car)
library(ppcor)

# matrix of scatter plots
pairs(iq_data)

# define variables
iq = iq_data$iq
mri = iq_data$mri
height = iq_data$height
weight = iq_data$weight

# fit to regression
fit = lm(iq ~ mri+weight+height, data=iq_data)
summary(fit)

# correlation matrix
cor(iq_data)

# partial correlations
pcor.test(iq, height, mri)
pcor.test(iq, weight, mri)

