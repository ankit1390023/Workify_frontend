import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useGetJobByAdmin from '../hooks/useGetJobByAdmin';
import AdminJobsTable from './AdminJobsTable';
import { setSearchJobByText } from '@/redux/jobSlice';
import { useEffect, useState } from 'react';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import Chat from '../ai/Chat';
import { useTheme } from '@/context/ThemeContext';

const AdminJobs = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    useGetJobByAdmin();
    const [input, setInput] = useState("");
    useEffect(() => {
        dispatch(setSearchJobByText(input));
    }, [input, setInput])

    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <div className='max-w-4xl max-h-full py-6 mx-auto'>
                <div className='flex justify-center'>
                    <Input
                        type='text'
                        placeholder='Search by Jobs or Company Name'
                        className='w-[80%] p-2 border-2 border-gray-300 dark:border-gray-700 bg-background text-foreground'
                        autoFocus={true}
                        required={true}
                        autoComplete='on'
                        spellCheck='false'
                        title='Input company name for register'
                        invalid={false}
                        onChange={(e) => setInput(e.target.value)}
                    >
                    </Input>
                    <Button
                        onClick={() => navigate('/admin/postJobs')}
                        className='ml-2 text-sm p-2 text-white bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 rounded-md'>
                        Post Jobs
                    </Button>
                </div>
                <h1 className='text-center text-2xl my-5 text-foreground'>List of Jobs Created By Admin</h1>
                <AdminJobsTable />
                <Chat/>
            </div>
            <Footer/>
        </div>
    )
}

export default AdminJobs