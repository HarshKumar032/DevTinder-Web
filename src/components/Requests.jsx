import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/view/request/pending", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data)); // backend returns { data: [...] }
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return <div className="p-10">Loading requests...</div>;

  if (requests.length === 0)
    return <h1 className="flex justify-center my-10">No Requests Found</h1>;

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl mb-4">
        Connection Requests
      </h1>

      {requests.map((request) => {
        const { firstName, lastName, photourl, age, gender, about } =
          request.fromUserId;
        const requestId = request._id;

        return (
          <div
            key={requestId}
            className="flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 max-w-3xl mx-auto"
          >
            <img
              alt="user"
              className="w-20 h-20 rounded-full object-cover"
              src={
                photourl?.startsWith("http")
                  ? photourl
                  : `${BASE_URL}/${photourl}`
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />

            <div className="text-left mx-4 flex-1">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>

            <div className="space-x-2">
              <button
                className="btn btn-success"
                onClick={() => reviewRequest("accept", requestId)}
              >
                Accept
              </button>
              <button
                className="btn btn-error"
                onClick={() => reviewRequest("reject", requestId)}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
