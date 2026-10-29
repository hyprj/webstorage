import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { Sidebar } from "./components/Sidebar";
import { FoldersView } from "./features/foldersView";
import { TrashView } from "./features/trashView/TrashView";

function App() {
  const [activeItem, setActiveItem] = useState<"files" | "trash">("files");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <Sidebar activeItem={activeItem} onNavigate={setActiveItem} />
        <main className="min-w-0 flex-1 p-6">
          {activeItem === "files" ? <FoldersView /> : <TrashView />}
        </main>
      </div>
    </div>
  );
}

export default App;
