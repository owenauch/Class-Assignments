df <- read.table("MenTripleJumpOlympics.txt", header=TRUE)

#five number summary
fivenum(df$Dist)

#scatter plot with regression line
plot(df, main="Triple Jump Distance Plotted Against Year")
abline(lm(df$Dist~df$Year))

#covariance
cov(df$Year, df$Dist)

#correlation
cor(df$Year, df$Dist)