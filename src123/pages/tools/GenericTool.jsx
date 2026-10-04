import ToolLayout from '../../components/ToolLayout';

export default function GenericTool({ title }) {
  return (
    <ToolLayout 
      title={title} 
      description={`Free online ${title} tool for developers.`} 
      url={`/${title.toLowerCase().replace(/ /g, '-')}`}
      intro={`This is the placeholder implementation for ${title}.`}
    >
      <div className="p-12 text-center text-gray-500 dark:text-gray-400">
        <p className="mb-4">The UI for <strong>{title}</strong> goes here.</p>
        <p className="text-sm">You can build out the logic for this tool in its own separate file based on the JsonFormatter example.</p>
      </div>
    </ToolLayout>
  );
}
