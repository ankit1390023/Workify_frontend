import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Loader, Building2, Globe, MapPin, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

// Define the schema using Zod
const companySchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  website: z.string().url('Please enter a valid website URL'),
  description: z.string().optional(),
});

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const CompaniesCreate = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('companyName', data.companyName);
    formData.append('location', data.location);
    formData.append('website', data.website);
    if (data.description) formData.append('description', data.description);
    // if (data?.logo && data?.logo[0]) formData.append('logo', data.logo[0]);

    try {
    
      const res = await axios.post(`${API_END_POINT}/company/register`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
      });

      if (res.data.success) {
        toast.success('Company registered successfully.');
        const companyId = res?.data?.data?._id;
        console.log(companyId);
        navigate(`/admin/companies/${companyId}`);
      } else {
        toast.error(`Failed to register company: ${res.data.message}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during company registration";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header/>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl font-bold">Register a New Company</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Please provide your company details. You can update them later if needed.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-foreground">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      type="text"
                      {...register('companyName')}
                      placeholder="Enter company name"
                      className="pl-10 bg-background text-foreground border-border focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-sm text-destructive">{errors.companyName.message}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-foreground">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      type="text"
                      {...register('location')}
                      placeholder="Enter company location"
                      className="pl-10 bg-background text-foreground border-border focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-foreground">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      {...register('website')}
                      placeholder="https://example.com"
                      className="pl-10 bg-background text-foreground border-border focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  {errors.website && (
                    <p className="text-sm text-destructive">{errors.website.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-foreground">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Enter company description"
                    className="min-h-[100px] bg-background text-foreground border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigate('/admin/companies')}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4" />
                      Register Company
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer/>
    </div>
  );
};

export default CompaniesCreate;
