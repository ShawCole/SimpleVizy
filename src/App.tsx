import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import DataFilter from './components/DataFilter';
import FileInfo from './components/FileInfo';
import FilterNotes from './components/FilterNotes';
import ContactData from './components/sections/ContactData';
import TopHighlights from './components/sections/TopHighlights';
import CompanyDetails from './components/sections/CompanyDetails';
import AudienceDemographics from './components/sections/AudienceDemographics';
import FinancialDetails from './components/sections/FinancialDetails';
import { B2BData, B2CData } from './types/data';
import { getAvailableColumns } from './utils/validation';
import CustomReport from './components/CustomReport';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

interface DataState {
  data: B2BData[] | B2CData[] | null;
  fileName: string;
}

function App() {
  const [b2bData, setB2BData] = useState<DataState>({ data: null, fileName: '' });
  const [b2cData, setB2CData] = useState<DataState>({ data: null, fileName: '' });
  const [activeB2BColumns, setActiveB2BColumns] = useState<Set<string>>(new Set());
  const [activeB2CColumns, setActiveB2CColumns] = useState<Set<string>>(new Set());
  const [b2bFilteredData, setB2BFilteredData] = useState<B2BData[] | null>(null);
  const [b2cFilteredData, setB2CFilteredData] = useState<B2CData[] | null>(null);
  const [showB2BUnknowns, setShowB2BUnknowns] = useState(false);
  const [showB2CUnknowns, setShowB2CUnknowns] = useState(false);

  const handleB2BDataLoaded = useCallback((data: B2BData[], fileName: string) => {
    setB2BData({ data, fileName });
    setB2BFilteredData(data);
    setActiveB2BColumns(new Set());
  }, []);

  const handleB2CDataLoaded = useCallback((data: B2CData[], fileName: string) => {
    setB2CData({ data, fileName });
    setB2CFilteredData(data);
    setActiveB2CColumns(new Set());
  }, []);

  const handleB2BFiltered = useCallback((filteredData: B2BData[], showUnknowns: boolean) => {
    setB2BFilteredData(filteredData);
    setShowB2BUnknowns(showUnknowns);
  }, []);

  const handleB2CFiltered = useCallback((filteredData: B2CData[], showUnknowns: boolean) => {
    setB2CFilteredData(filteredData);
    setShowB2CUnknowns(showUnknowns);
  }, []);

  const handleB2BColumnSelect = useCallback((column: string) => {
    setActiveB2BColumns(prev => {
      const newColumns = new Set(prev);
      if (newColumns.has(column)) {
        newColumns.delete(column);
      } else {
        newColumns.add(column);
      }
      return newColumns;
    });
  }, []);

  const handleB2CColumnSelect = useCallback((column: string) => {
    setActiveB2CColumns(prev => {
      const newColumns = new Set(prev);
      if (newColumns.has(column)) {
        newColumns.delete(column);
      } else {
        newColumns.add(column);
      }
      return newColumns;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data Visualization Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Upload your B2B or B2C data to get started
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mb-8">
          <FileUpload type="b2b" onDataLoaded={handleB2BDataLoaded} />
          <FileUpload type="b2c" onDataLoaded={handleB2CDataLoaded} />
        </div>

        {(b2bData.data || b2cData.data) && (
          <div className="space-y-8">
            <FileInfo
              b2bFileName={b2bData.fileName}
              b2cFileName={b2cData.fileName}
              b2bRecords={b2bData.data?.length}
              b2cRecords={b2cData.data?.length}
            />
            <FilterNotes />
          </div>
        )}

        {b2bData.data && (
          <div className="space-y-6 mt-12">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">B2B Dataset</h2>
              <DataFilter
                type="b2b"
                availableColumns={getAvailableColumns(b2bData.data, 'b2b')}
                activeColumns={activeB2BColumns}
                onColumnSelect={handleB2BColumnSelect}
                data={b2bData.data}
                fileName={b2bData.fileName}
                onDataFiltered={handleB2BFiltered}
                showUnknowns={showB2BUnknowns}
              />
              {b2bFilteredData && (
                <div className="space-y-6">
                  <ContactData data={b2bFilteredData} />
                  <div className="space-y-6">
                    <TopHighlights data={b2bFilteredData} showUnknowns={showB2BUnknowns} />
                    <CompanyDetails data={b2bFilteredData} showUnknowns={showB2BUnknowns} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {b2cData.data && (
          <div className="space-y-6 mt-12">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">B2C Dataset</h2>
              <DataFilter
                type="b2c"
                availableColumns={getAvailableColumns(b2cData.data, 'b2c')}
                activeColumns={activeB2CColumns}
                onColumnSelect={handleB2CColumnSelect}
                data={b2cData.data}
                fileName={b2cData.fileName}
                onDataFiltered={handleB2CFiltered}
                showUnknowns={showB2CUnknowns}
              />
              {b2cFilteredData && (
                <div className="space-y-6">
                  <ContactData data={b2cFilteredData} />
                  <AudienceDemographics data={b2cFilteredData} showUnknowns={showB2CUnknowns} />
                  <FinancialDetails data={b2cFilteredData} showUnknowns={showB2CUnknowns} />
                </div>
              )}
            </div>
          </div>
        )}

        <Tabs defaultValue="default">
          <TabsList>
            <TabsTrigger value="default">Default View</TabsTrigger>
            <TabsTrigger value="custom">Custom Report</TabsTrigger>
          </TabsList>

          <TabsContent value="default">
            {/* Existing visualization components */}
          </TabsContent>

          <TabsContent value="custom">
            <CustomReport
              b2bData={b2bData}
              b2cData={b2cData}
              showUnknowns={showB2BUnknowns || showB2CUnknowns}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;