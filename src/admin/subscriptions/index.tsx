import { useEffect, useState, useCallback } from "react";
import { GET, PUT } from "../../utils/apiCalls";
import API from "../../config/api";
import LoadingBox from "../../components/loadingBox";
import SubHeader from "../../components/pageHeader";
import { Modal } from "antd";
import SubscriptionsAdminForm from "./components/form";
import SubscriptionsTable from "./components/table";
import { debounce } from "lodash";

interface Subscription {
  id: number;
  userId: number;
  company: number;
  counter: number;
  period: number;
  price: number;
  retailXpressWithTaxgo: boolean;
  soleTrader: boolean;
  subscriptionExpiry: string;
  userDetails: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface Meta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface ApiResponse {
  data: Subscription[];
  meta: Meta;
}

const Subscriptions = () => {
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const fetchData = useCallback(
    async (page: number, take: number, search: string = "") => {
      try {
        setLoading(true);
        const response = (await GET(
          `${API.SUBSCRIPTIONS}?order=DESC&page=${page}&take=${take}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }`,
          null
        )) as { data: ApiResponse };

        if (response?.data?.data) {
          setData(response.data.data);
          setMeta(response.data.meta);
        } else {
          console.error("Invalid response format:", response);
          setData([]);
          setMeta({
            page: 1,
            take: 10,
            itemCount: 0,
            pageCount: 1,
            hasPreviousPage: false,
            hasNextPage: false,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setMeta({
          page: 1,
          take: 10,
          itemCount: 0,
          pageCount: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchData(1, take, query);
    }, 300),
    [take, fetchData]
  );

  useEffect(() => {
    fetchData(page, take, searchQuery);
  }, [page, take, fetchData]);

  const handleEdit = (record: Subscription) => {
    setSelectedSubscription(record);
    setIsModalVisible(true);
  };

  const handleSave = async (values: Subscription) => {
    try {
      setLoading2(true)
      const payload = {
        id: values.id,
        userId: values.userId,
        period: values.period,
        company: values.company,
        counter: values.counter,
        soleTrader: values.soleTrader,
        subscriptionExpiry: values.subscriptionExpiry,
        retailXpressWithTaxgo: values.retailXpressWithTaxgo,
      };
      await PUT(API.SUBSCRIPTIONS, payload);
      await fetchData(page, take, searchQuery);
      setIsModalVisible(false);
      setSelectedSubscription(null);
      setLoading2(false)
    } catch (error) {
      setLoading2(false)
      console.error("Error updating subscription:", error);
    }
  };

  const handlePageChange = (newPage: number, newTake: number) => {
    setPage(newPage);
    setTake(newTake);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // if (loading) {
  //   return <LoadingBox />;
  // }

  return (
    <div>
      <SubHeader title="Subscriptions" />
      <SubscriptionsTable
        products={data}
        title="Subscriptions"
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onEdit={handleEdit}
        meta={meta}
        loading={loading}
      />
      <Modal
        title="Edit Subscription"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedSubscription && (
          <SubscriptionsAdminForm
            initialValues={selectedSubscription}
            onSave={handleSave}
            onCancel={() => setIsModalVisible(false)}
            loading={loading2}
          />
        )}
      </Modal>
    </div>
  );
};

export default Subscriptions;