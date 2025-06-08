import { Helmet } from 'react-helmet-async';

interface SchemaMarkupProps {
  schema: object | object[];
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ schema }) => {
  const schemaArray = Array.isArray(schema) ? schema : [schema];
  
  return (
    <Helmet>
      {schemaArray.map((schemaItem, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaItem, null, 2)
          }}
        />
      ))}
    </Helmet>
  );
};

export default SchemaMarkup;