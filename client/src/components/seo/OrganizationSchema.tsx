import SchemaMarkup from './SchemaMarkup';
import { ORGANIZATION_DATA } from '../../data/schemaData';

const OrganizationSchema: React.FC = () => {
  return <SchemaMarkup schema={ORGANIZATION_DATA} />;
};

export default OrganizationSchema;