import { Client } from "@elastic/elasticsearch";
import { ELASTIC_API_KEY, ELASTIC_ENDPOINT } from "../shared/const";
import { BasicInfo, ElasticProduct, SEOInfo } from "../interfaces";
import { extractBasicProductInfo, extractSeoInfo } from "../helpers/ElasticHelper";

export class ElasticController {

  private elasticClient = new Client({
    node: ELASTIC_ENDPOINT,
    auth: {
      apiKey: ELASTIC_API_KEY,
    },
  });

  private indexProductVariation = async (
    client: Client,
    productVariationDocument: BasicInfo
  ): Promise<void> => {
    try {
      console.log('productVariationDocument', productVariationDocument);
      const response = await client.update({
        index: 'search-product',
        id: `${productVariationDocument.ASIN}`,
        body: {
          doc: { ...productVariationDocument }, // Updated data for the document
          upsert: { ...productVariationDocument } // If the document does not exist, insert this data
        },
        refresh: true,
      });

      console.log('Product created or updated successfully:', response);
    } catch (error) {
      console.error("Error indexing product variations:", error);
      throw error;
    }
  };

  private indexSEOInfo = async (
    client: Client,
    seoDocument: SEOInfo
  ): Promise<void> => {
    try {
      const response = await client.update({
        index: 'search-product-seo-info',
        id: `${seoDocument.ASIN}`,
        body: {
          doc: { ...seoDocument }, // Updated data for the document
          upsert: { ...seoDocument } // If the document does not exist, insert this data
        },
        refresh: true,
      });
      console.log("SEO information indexed successfully", response);
    } catch (error) {
      console.error("Error indexing SEO information:", error);
    }
  };

  public syncSingleProduct = async (productData: ElasticProduct): Promise<void> => {
    const variationDocuments = extractBasicProductInfo(productData);
    const seoDocument = extractSeoInfo(productData);
    try {
      await this.indexProductVariation(this.elasticClient, variationDocuments);
      await this.indexSEOInfo(this.elasticClient, seoDocument);
      console.log('Product sync successfully:');
    } catch (error) {
      console.log("Product was not synced:", error);
    }
    return;
  }

  public deleteProduct = async (ASIN: string): Promise<void> => {
    try {
      await this.elasticClient.delete({
        index: "search-product",
        id: ASIN
      });
      await this.elasticClient.delete({
        index: "search-product-seo-info",
        id: ASIN
      });
      console.log(`Document with id ${ASIN} deleted from index ${ASIN}`);
    } catch (error) {
      console.error(`Error deleting document: ${error}`);
    }
    return;
  }

  public bulkDelete = async (ASINS: any): Promise<void> => {
    try {
      console.log('ASINS', ASINS);
      const bulkRequestBody = ASINS.flatMap((id: string) => [
        { delete: { _index: "search-product", _id: `${id}` } },
        { delete: { _index: "search-product-seo-info", _id: `${id}` } }
      ]);

      const bulkResponse = await this.elasticClient.bulk({
        refresh: true,
        body: bulkRequestBody
      });

      if (bulkResponse.errors) {
        const erroredDocuments: any = [];
        bulkResponse.items.forEach((action: any) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              id: action[operation]._id,
              error: action[operation].error
            });
          }
        });
        console.error("Errors occurred while bulk deleting:", erroredDocuments);
      } else {
        console.log("Bulk delete operation completed successfully.");
      }
    } catch (error) {
      console.error("Error performing bulk delete operation:", error);
    }
  };
}
