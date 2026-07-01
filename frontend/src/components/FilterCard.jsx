import React from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const filterData = [
    {
        filterType: 'Location',
        key: 'location',
        array: ['Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Remote']
    },
    {
        filterType: 'Industry',
        key: 'industry',
        array: ['Frontend Developer', 'Backend Developer', 'FullStack Developer', 'Data Science', 'Graphic Designer']
    },
    {
        filterType: 'Salary (LPA)',
        key: 'salary',
        array: ['0-40k', '42k-1lakh', '1lakh-5lakh']
    }
]

const FilterCard = ({ filterState, setFilterState }) => {
    const hasActiveFilters = Object.values(filterState).some(Boolean)

    const changeHandler = (key, value) => {
        setFilterState(prev => ({ ...prev, [key]: value }))
    }

    const clearAll = () => {
        setFilterState({ location: '', industry: '', salary: '' })
    }

    return (
        <div className='w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='font-bold text-gray-900'>Filter Jobs</h1>
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className='text-xs text-[#6A38C2] font-medium hover:underline'
                    >
                        Clear All
                    </button>
                )}
            </div>
            <hr className='mb-4 border-gray-100' />
            <div className='space-y-5'>
                {filterData.map((data) => (
                    <div key={data.key}>
                        <h2 className='font-semibold text-sm text-gray-700 mb-2'>{data.filterType}</h2>
                        <RadioGroup
                            value={filterState[data.key]}
                            onValueChange={(value) => changeHandler(data.key, value)}
                        >
                            {data.array.map((item, idx) => {
                                const itemId = `${data.key}-${idx}`
                                return (
                                    <div key={itemId} className='flex items-center space-x-2 my-1.5'>
                                        <RadioGroupItem value={item} id={itemId} />
                                        <Label htmlFor={itemId} className='text-sm text-gray-600 cursor-pointer'>
                                            {item}
                                        </Label>
                                    </div>
                                )
                            })}
                        </RadioGroup>
                        {/* Individual clear for each filter type */}
                        {filterState[data.key] && (
                            <button
                                onClick={() => changeHandler(data.key, '')}
                                className='text-xs text-gray-400 hover:text-red-500 mt-1'
                            >
                                ✕ Clear
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FilterCard