import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AddGame from '../components/AddGame';
import SearchGames from '../components/SearchGames';
import ManageAccount from '../components/ManageAccount';
import ManageAdmins from '../components/ManageAdmins';


const Dashboard = () => {
  return (
    <div className="p-4">
      <h1>Admin Dashboard</h1>
      <Tabs defaultValue="search">
      <TabsList className="mb-4">
  <TabsTrigger value="search">Search Games</TabsTrigger>
  <TabsTrigger value="add">Add Games</TabsTrigger>
  <TabsTrigger value="admins">Manage Admins</TabsTrigger>
  <TabsTrigger value="account">Manage Account</TabsTrigger>
</TabsList>

        <TabsContent value="search">
          <SearchGames />
        </TabsContent>
        <TabsContent value="add">
          <AddGame />
        </TabsContent>
<TabsContent value="admins">
  <ManageAdmins />
</TabsContent>
        <TabsContent value="account">
          <ManageAccount />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;