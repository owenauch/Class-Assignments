# generate 100 random samples of size 5 N(10, 3^2)
rand_norms <- replicate(100, rnorm(5, mean=10, sd=3))

# Xbars, variances and sds
norm_sample_means <- colMeans(rand_norms)
norm_sample_variances <- apply(rand_norms, 2, var)
norm_sample_sd <- sqrt(norm_sample_variances)

# T 
t <- ((norm_sample_means - 10) / (sqrt(5) / norm_sample_sd))
quantile(t, probs = c(0.25, 0.5, 0.75))

# actual t-quantiles
qt(c(.25, .5, .75), 4)
