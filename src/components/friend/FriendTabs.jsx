function FriendTabs({ activeTab, setActiveTab, requestCount, sentCount }) {
  const tabs = [
    { key: "all", label: "All Friends" },
    { key: "requests", label: `Requests (${requestCount})` },
    { key: "sent", label: `Sent (${sentCount})` },
    { key: "search", label: "Search" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
              ${
                activeTab === tab.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default FriendTabs;
