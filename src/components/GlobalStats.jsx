import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import useGlobalStats from './hooks/useGlobalStats';
import { Loader } from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';

const AnimatedNumber = ({ value, duration = 2 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    setIsVisible(true);
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{displayValue}</motion.span>;
};

export default function GlobalStats() {
  useGlobalStats();
  useDashboardData();
  const { totalJobs, totalUsers, totalApplications, totalCompanies, averageProfileScore, loading, error } = useSelector((state) => state.globalStats);
  const { stats: { totalAppliedJobs, totalInterviews, totalPending, totalRejected, totalSelected, profileScore } } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-[50%] bg-background">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Platform Statistics
          </h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <span className="text-lg text-muted-foreground">
                Loading platform statistics...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">
              {error}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Global Platform Stats */}
              <Card className="bg-card hover:bg-accent/50 transition-colors duration-200">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">Total Jobs Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">
                    <AnimatedNumber value={totalJobs} />
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card hover:bg-accent/50 transition-colors duration-200">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">Registered Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">
                    <AnimatedNumber value={totalCompanies} />
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card hover:bg-accent/50 transition-colors duration-200">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">
                    <AnimatedNumber value={totalUsers} />
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card hover:bg-accent/50 transition-colors duration-200">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">
                    <AnimatedNumber value={totalApplications} />
                  </p>
                </CardContent>
              </Card>

              {/* User-specific Stats */}
              {user && (
                <>
                  <Card className="bg-card hover:bg-accent/50 transition-colors duration-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-card-foreground">Your Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-primary">
                        <AnimatedNumber value={totalAppliedJobs} />
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card hover:bg-accent/50 transition-colors duration-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-card-foreground">Interviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-primary">
                        <AnimatedNumber value={totalInterviews} />
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card hover:bg-accent/50 transition-colors duration-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-card-foreground">Pending Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-primary">
                        <AnimatedNumber value={totalPending} />
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card hover:bg-accent/50 transition-colors duration-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-card-foreground">Profile Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-primary">
                        <AnimatedNumber value={profileScore} />%
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
