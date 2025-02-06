import { Input } from '../ui/input'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import useGetAllCompany from '../hooks/useGetAllCompany';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import { useEffect, useState } from 'react';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import Chat from '../ai/Chat';


const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useGetAllCompany();
  const [input, setInput] = useState("");
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  },[input, setInput])
  
  return (
    <div>
      <Header/>

    <div className='max-w-4xl max-h-full  py-6 mx-auto '>
      <div className='flex  justify-center'>
        <Input
          type='text'
          placeholder='Search your registered companies..'
          className='w-[80%] p-2 border-2 border-gray-300'
          autoFocus={true}
          required={true}
          autoComplete='on'
          spellCheck='false'
          title='Input company name for register'
          invalid={false}
          onChange={(e) =>setInput(e.target.value)}
      
        >
        </Input>
        <Button
          onClick={() => navigate('/admin/companies/create')}
          className='ml-2  text-sm p-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md'>
          New Company
        </Button>
      </div>
      <h1 className='text-center text-2xl my-5 '>Registered Companies</h1>
        <CompaniesTable />
        <Chat/>
      </div>
      <Footer/>
    </div>
  )
}

export default Companies