# get z of alpha = .01
z_alpha <- qnorm(.01)

# list of the true means to test
# and array to save data
true_means <- c(3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0)

# loop through all and calculate power
powers <- pnorm(z_alpha + ((true_means - 3.4) * 10))

powers_2 <- pnorm(z_alpha + ((true_means - 3.4) * 20))

# graph
plot(true_means, powers, col="red", main="Power graph")
lines(true_means, powers_2, col="green")