# generate 1000 poisson random with sample size 30 and lambda 20
lambda = 20
rand_pois = data.frame(replicate(1000, rpois(30, lambda)))

# sample mean and variance in each sample
pois_means = colMeans(rand_pois)
pois_variance = apply(rand_pois, 2, var)

# histograms
hist(pois_means)
hist(pois_variance)

# sample mean and variance of means + MSE
pois_m_mean = mean(pois_means)
pois_m_variance = var(pois_means)
mse_mean = (pois_m_mean - lambda)^2 + pois_m_variance

# sample mean and variance of variances + MSE
pois_v_mean = mean(pois_variance)
pois_v_variance = var(pois_variance)
mse_var = (pois_v_mean - lambda)^2 + pois_v_variance

# 95% CI -- Xbar - 1.96(S/(sqrt(30)))
s_counter = 0
s_width = NULL
for (i in 1:1000) {
  mean = mean(rand_pois[,i])
  std = sqrt(var(rand_pois[,i]))
  lower = mean - (1.96*(std/sqrt(30)))
  upper = mean + (1.96*(std/sqrt(30)))
  s_width = c(s_width, (upper-lower))
  if (lower > 20 || upper < 20) {
    s_counter = s_counter + 1
  }
}

# 95% CI -- Xbar - 1.96(sqrt(Xbar)/(sqrt(30)))
xbar_counter = 0
xbar_width = NULL
for (i in 1:1000) {
  mean = mean(rand_pois[,i])
  lower = mean - (1.96*(sqrt(mean)/sqrt(30)))
  upper = mean + (1.96*(sqrt(mean)/sqrt(30)))
  xbar_width = c(xbar_width, (upper-lower))
  if (lower > 20 || upper < 20) {
    xbar_counter = xbar_counter + 1
  }
}

# means of widths of each interval
xbar_width_mean = mean(xbar_width)
s_width_mean = mean(s_width)
