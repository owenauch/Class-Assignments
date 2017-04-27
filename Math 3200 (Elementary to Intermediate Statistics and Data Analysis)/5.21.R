# generate 100 random samples of size 5 N(10, 3^2)
rand_norms_5 <- replicate(100, rnorm(5, mean=10, sd=3))

# variances
norm_sample_variances <- apply(rand_norms_5, 2, var)

# standardize 
u <- 4*norm_sample_variances / 9

# percentiles of sample
quantile(u, probs = c(0.25, 0.5, 0.75))

# actual quantiles
qchisq(c(.25, .5, .75), 4)

# generate 100 random samples of size 7 N(5, 9)
rand_norms_7 <- replicate(100, rnorm(7, mean=5, sd=3))

# variances
norm_sample_variances_7 <- apply(rand_norms_7, 2, var)

# standardize 
u_7 <- 6*norm_sample_variances_7 / 9
hist(u_7)

# ratios
ratio <- u / u_7
inv_ratio <- u_7 / u

# count number greater than 4
counter_ratio = 0 
for (i in 1:100) {
  if (ratio[i] > 4) {
    counter_ratio = counter_ratio + 1;
  }
}

counter_inv_ratio = 0 
for (i in 1:100) {
  if (inv_ratio[i] > 4) {
    counter_inv_ratio = counter_inv_ratio + 1;
  }
}

# is an f-dist df=4,6 or 6,4
