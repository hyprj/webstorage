import { AppHeader } from "./components/AppHeader";
import { Sidebar } from "./components/Sidebar";
import { FoldersView } from "./features/foldersView";
import { TrashView } from "./features/trashView/TrashView";
import { DataRetentionView } from "./features/dataRetentionView";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 p-6">
          <Routes>
            <Route path="/" element={<FoldersView />} />
            <Route path="/files" element={<Navigate to="/" replace />} />
            <Route path="/trash" element={<TrashView />} />
            <Route path="/data-retention" element={<DataRetentionView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
