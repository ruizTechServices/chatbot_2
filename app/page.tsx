export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold underline mb-4">24HourGPT Features Checklist</h1>
      <ul className="list-none space-y-2">
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="auth" />
          <label htmlFor="auth">Authentication</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="prisma" />
          <label htmlFor="prisma">Prisma ORM</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="sqlite" />
          <label htmlFor="sqlite">SQLite Database</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="multitenancy" />
          <label htmlFor="multitenancy">Multi-tenancy</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="square" />
          <label htmlFor="square">Square API Payments</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="timer" />
          <label htmlFor="timer">24-hour Timer Countdown after $1 USD Payment</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="pinecone" />
          <label htmlFor="pinecone">Pinecone Integration</label>
        </li>
      </ul>
    </div>
  );
}
