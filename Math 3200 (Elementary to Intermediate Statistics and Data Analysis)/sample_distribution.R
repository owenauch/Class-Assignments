#generate 1000 normal randoms 100 times, then plot sample means
#makes a matrix with 1000 rows, with each column as one run of 1000
#sqrd_norms is a matrix with all the values squared
rand_norms <- replicate(100, rnorm(1000, mean=1, sd=1))
norm_sample_means <- colMeans(rand_norms)
hist(norm_sample_means)
norm_sample_variances <- apply(rand_norms, 2, var)
hist(norm_sample_variances)

#generate 1000 exponential randoms 100 times, then plot sample means
#makes a matrix with 1000 rows, with each column as one run of 1000
rand_exp <- replicate(100, rexp(1000, rate=1))
exp_sample_means <- colMeans(rand_exp)
hist(exp_sample_means)
exp_sample_variances <- apply(rand_exp, 2, var)
hist(exp_sample_variances)


#generate 1000 poisson randoms 100 times, then plot sample means
#makes a matrix with 1000 rows, with each column as one run of 1000
rand_pois <- replicate(100, rpois(1000, 1))
pois_sample_means <- colMeans(rand_pois)
hist(pois_sample_means)
pois_sample_variances <- apply(rand_pois, 2, var)
hist(pois_sample_variances)


#generate 1000 binomial randoms 100 times, then plot sample means
#makes a matrix with 1000 rows, with each column as one run of 1000
rand_bin <- replicate(100, rbinom(1000, 10, .1))
bin_sample_means <- colMeans(rand_bin)
hist(bin_sample_means)
bin_sample_variances <- apply(rand_bin, 2, var)
hist(bin_sample_variances)

